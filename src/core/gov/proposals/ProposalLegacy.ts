import { Coins } from '../../Coins';
import { num } from '../../num';
import { JSONSerializable } from '../../../util/json';
import { ParameterChangeProposal } from '../../params/proposals';
import { ClientUpdateProposal } from '../../ibc/proposals';
import { TextProposal } from './TextProposal';
import {
  Proposal as Proposal_pb,
  ProposalStatus,
  TallyResult,
  proposalStatusFromJSON,
  proposalStatusToJSON,
} from '@initia/initia.proto/cosmos/gov/v1beta1/gov';
import { Any } from '@initia/initia.proto/google/protobuf/any';
import Long from 'long';

/**
 * Stores information pertaining to a submitted proposal, such as its status and time of
 * the voting period
 */
export class ProposalLegacy extends JSONSerializable<
  ProposalLegacy.Amino,
  ProposalLegacy.Data,
  ProposalLegacy.Proto
> {
  /**
   *
   * @param id proposal's ID
   * @param content content of the proposal
   * @param status proposal's status
   * @param final_tally_result tally result
   * @param submit_time time proposal was submitted and deposit period started
   * @param deposit_end_time time deposit period will end
   * @param total_deposit amount of coins deposited by all users
   * @param voting_start_time time voting period will start
   * @param voting_end_time time voting period will end
   */
  constructor(
    public id: number,
    public content: ProposalLegacy.Content,
    public status: ProposalStatus,
    public final_tally_result: ProposalLegacy.FinalTallyResult,
    public submit_time: Date,
    public deposit_end_time: Date,
    public total_deposit: Coins,
    public voting_start_time: Date,
    public voting_end_time: Date
  ) {
    super();
  }

  public static fromAmino(data: ProposalLegacy.Amino): ProposalLegacy {
    const {
      id,
      content,
      status,
      final_tally_result,
      submit_time,
      deposit_end_time,
      total_deposit,
      voting_start_time,
      voting_end_time,
    } = data;

    return new ProposalLegacy(
      Number.parseInt(id),
      ProposalLegacy.Content.fromAmino(content),
      status,
      {
        yes: num(final_tally_result.yes ?? 0).toFixed(0),
        no: num(final_tally_result.no ?? 0).toFixed(0),
        abstain: num(final_tally_result.abstain ?? 0).toFixed(0),
        no_with_veto: num(final_tally_result.no_with_veto ?? 0).toFixed(0),
      },
      new Date(submit_time),
      new Date(deposit_end_time),
      Coins.fromAmino(total_deposit),
      new Date(voting_start_time),
      new Date(voting_end_time)
    );
  }

  public toAmino(): ProposalLegacy.Amino {
    const { status, final_tally_result } = this;

    return {
      id: this.id.toFixed(),
      content: this.content.toAmino(),
      status: status,
      final_tally_result: {
        yes: num(final_tally_result.yes).toFixed(),
        no: num(final_tally_result.no).toFixed(),
        abstain: num(final_tally_result.abstain).toFixed(),
        no_with_veto: num(final_tally_result.no_with_veto).toFixed(),
      },
      submit_time: this.submit_time.toISOString(),
      deposit_end_time: this.deposit_end_time.toISOString(),
      total_deposit: this.total_deposit.toAmino(),
      voting_start_time: this.voting_start_time.toISOString(),
      voting_end_time: this.voting_end_time.toISOString(),
    };
  }

  public static fromData(data: ProposalLegacy.Data): ProposalLegacy {
    const {
      proposal_id,
      content,
      status,
      final_tally_result,
      submit_time,
      deposit_end_time,
      total_deposit,
      voting_start_time,
      voting_end_time,
    } = data;

    return new ProposalLegacy(
      Number.parseInt(proposal_id),
      ProposalLegacy.Content.fromData(content),
      proposalStatusFromJSON(status),
      {
        yes: num(final_tally_result?.yes ?? 0).toFixed(0),
        no: num(final_tally_result?.no ?? 0).toFixed(0),
        abstain: num(final_tally_result?.abstain ?? 0).toFixed(0),
        no_with_veto: num(final_tally_result?.no_with_veto ?? 0).toFixed(0),
      },
      new Date(submit_time),
      new Date(deposit_end_time),
      Coins.fromData(total_deposit),
      new Date(voting_start_time),
      new Date(voting_end_time)
    );
  }

  public toData(): ProposalLegacy.Data {
    const { status, final_tally_result } = this;

    return {
      proposal_id: this.id.toFixed(),
      content: this.content.toData(),
      status: proposalStatusToJSON(status),
      final_tally_result: {
        yes: final_tally_result.yes.toString(),
        no: final_tally_result.no.toString(),
        abstain: final_tally_result.abstain.toString(),
        no_with_veto: final_tally_result.no_with_veto.toString(),
      },
      submit_time: this.submit_time.toISOString(),
      deposit_end_time: this.deposit_end_time.toISOString(),
      total_deposit: this.total_deposit.toData(),
      voting_start_time: this.voting_start_time.toISOString(),
      voting_end_time: this.voting_end_time.toISOString(),
    };
  }

  public static fromProto(data: ProposalLegacy.Proto): ProposalLegacy {
    const id = data.proposalId;
    const content = data.content;
    const status = data.status;
    const final_tally_result = data.finalTallyResult;
    const submit_time = data.submitTime;
    const deposit_end_time = data.depositEndTime;
    const total_deposit = data.totalDeposit;
    const voting_start_time = data.votingStartTime;
    const voting_end_time = data.votingEndTime;

    return new ProposalLegacy(
      id.toNumber(),
      ProposalLegacy.Content.fromProto(content as Any),
      status,
      {
        yes: num(final_tally_result?.yes ?? 0).toFixed(0),
        no: num(final_tally_result?.no ?? 0).toFixed(0),
        abstain: num(final_tally_result?.abstain ?? 0).toFixed(0),
        no_with_veto: num(final_tally_result?.noWithVeto ?? 0).toFixed(0),
      },
      submit_time as Date,
      deposit_end_time as Date,
      Coins.fromProto(total_deposit),
      voting_start_time as Date,
      voting_end_time as Date
    );
  }

  public toProto(): ProposalLegacy.Proto {
    const { status, final_tally_result } = this;

    let ftr: TallyResult | undefined;
    if (final_tally_result) {
      ftr = TallyResult.fromPartial({
        yes: final_tally_result.yes.toString(),
        no: final_tally_result.no.toString(),
        abstain: final_tally_result.abstain.toString(),
        noWithVeto: final_tally_result.no_with_veto.toString(),
      });
    }

    return Proposal_pb.fromPartial({
      proposalId: Long.fromNumber(this.id),
      content: this.content.packAny(),
      status,
      finalTallyResult: ftr,
      submitTime: this.submit_time,
      depositEndTime: this.deposit_end_time,
      totalDeposit: this.total_deposit.toProto(),
      votingEndTime: this.voting_end_time,
      votingStartTime: this.voting_start_time,
    });
  }
}

export namespace ProposalLegacy {
  export const Status = ProposalStatus;
  export type Status = ProposalStatus;

  export interface FinalTallyResult {
    yes: string;
    abstain: string;
    no: string;
    no_with_veto: string;
  }

  export type Content =
    | TextProposal
    | ParameterChangeProposal
    | ClientUpdateProposal;

  export namespace Content {
    export type Amino =
      | TextProposal.Amino
      | ParameterChangeProposal.Amino
      | ClientUpdateProposal.Amino;

    export type Data =
      | TextProposal.Data
      | ParameterChangeProposal.Data
      | ClientUpdateProposal.Data;

    export type Proto =
      | TextProposal.Proto
      | ParameterChangeProposal.Proto
      | ClientUpdateProposal.Proto;

    export function fromAmino(
      amino: ProposalLegacy.Content.Amino
    ): ProposalLegacy.Content {
      switch (amino.type) {
        case 'cosmos-sdk/TextProposal':
          return TextProposal.fromAmino(amino);
        case 'cosmos-sdk/ParameterChangeProposal':
          return ParameterChangeProposal.fromAmino(amino);
        case 'ibc/ClientUpdateProposal':
          return ClientUpdateProposal.fromAmino(amino);
      }
    }

    export function fromData(
      data: ProposalLegacy.Content.Data
    ): ProposalLegacy.Content {
      switch (data['@type']) {
        case '/cosmos.gov.v1beta1.TextProposal':
          return TextProposal.fromData(data);
        case '/cosmos.params.v1beta1.ParameterChangeProposal':
          return ParameterChangeProposal.fromData(data);
        case '/ibc.core.client.v1.ClientUpdateProposal':
          return ClientUpdateProposal.fromData(data);
      }
    }

    export function fromProto(anyProto: Any): ProposalLegacy.Content {
      const typeUrl = anyProto.typeUrl;
      switch (typeUrl) {
        case '/cosmos.gov.v1beta1.TextProposal':
          return TextProposal.unpackAny(anyProto);
        case '/cosmos.params.v1beta1.ParameterChangeProposal':
          return ParameterChangeProposal.unpackAny(anyProto);
        case '/ibc.core.client.v1.ClientUpdateProposal':
          return ClientUpdateProposal.unpackAny(anyProto);
      }

      throw `Proposal content ${typeUrl} not recognized`;
    }
  }

  export interface Amino {
    content: Content.Amino;
    id: string;
    status: number;
    final_tally_result: {
      yes: string;
      abstain: string;
      no: string;
      no_with_veto: string;
    };
    submit_time: string;
    deposit_end_time: string;
    total_deposit: Coins.Amino;
    voting_start_time: string;
    voting_end_time: string;
  }

  export interface Data {
    content: Content.Data;
    proposal_id: string;
    status: string;
    final_tally_result: {
      yes: string;
      abstain: string;
      no: string;
      no_with_veto: string;
    };
    submit_time: string;
    deposit_end_time: string;
    total_deposit: Coins.Data;
    voting_start_time: string;
    voting_end_time: string;
  }

  export type Proto = Proposal_pb;
}
