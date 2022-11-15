import { JSONSerializable } from '../../util/json';
import { BaseVestingAccount } from './BaseVestingAccount';
import { PublicKey } from '../PublicKey';

import { BaseVestingAccount as BaseVestingAccount_pb } from '@initia/initia.proto/cosmos/vesting/v1beta1/vesting';
import { DelayedVestingAccount as DelayedVestingAccount_pb } from '@initia/initia.proto/cosmos/vesting/v1beta1/vesting';
import { Any } from '@initia/initia.proto/google/protobuf/any';

/**
 * DelayedVestingAccount implements the VestingAccount interface. It vests all
 * coins after a specific time, but non prior. In other words, it keeps them
 * locked until a specified time.
 */
export class DelayedVestingAccount extends JSONSerializable<
  DelayedVestingAccount.Amino,
  DelayedVestingAccount.Data,
  DelayedVestingAccount.Proto
> {
  /**
   *
   * @param base_vesting_account account information
   */
  constructor(public base_vesting_account: BaseVestingAccount) {
    super();
  }

  public getAccountNumber(): number {
    return this.base_vesting_account.getAccountNumber();
  }

  public getSequenceNumber(): number {
    return this.base_vesting_account.getSequenceNumber();
  }

  public getPublicKey(): PublicKey | null {
    return this.base_vesting_account.base_account.public_key;
  }

  public toAmino(): DelayedVestingAccount.Amino {
    const { base_vesting_account } = this;
    return {
      type: 'cosmos-sdk/DelayedVestingAccount',
      value: {
        base_vesting_account: base_vesting_account.toAmino().value,
      },
    };
  }

  public static fromAmino(data: DelayedVestingAccount.Amino): DelayedVestingAccount {
    const base_vesting_account = BaseVestingAccount.fromAmino({
      type: 'cosmos-sdk/BaseVestingAccount',
      value: data.value.base_vesting_account,
    });
    return new DelayedVestingAccount(base_vesting_account);
  }

  public toData(): DelayedVestingAccount.Data {
    const { base_vesting_account } = this;
    return {
      '@type': '/cosmos.vesting.v1beta1.DelayedVestingAccount',
      base_vesting_account: base_vesting_account.toData(),
    };
  }

  public static fromData(data: DelayedVestingAccount.Data): DelayedVestingAccount {
    const base_vesting_account = BaseVestingAccount.fromData({
      '@type': '/cosmos.vesting.v1beta1.BaseVestingAccount',
      ...data.base_vesting_account,
    });
    return new DelayedVestingAccount(base_vesting_account);
  }

  public toProto(): DelayedVestingAccount.Proto {
    const { base_vesting_account } = this;

    return DelayedVestingAccount_pb.fromPartial({
      baseVestingAccount: base_vesting_account.toProto(),
    });
  }

  public static fromProto(DelayedVestingAccountProto: DelayedVestingAccount.Proto): DelayedVestingAccount {
    const baseVestingAccount = BaseVestingAccount.fromProto(
      DelayedVestingAccountProto.baseVestingAccount as BaseVestingAccount_pb
    );
    return new DelayedVestingAccount(baseVestingAccount);
  }

  public packAny(): Any {
    return Any.fromPartial({
      typeUrl: '/cosmos.vesting.v1beta1.DelayedVestingAccount',
      value: DelayedVestingAccount_pb.encode(this.toProto()).finish(),
    });
  }

  public static unpackAny(pubkeyAny: Any): DelayedVestingAccount {
    return DelayedVestingAccount.fromProto(DelayedVestingAccount_pb.decode(pubkeyAny.value));
  }
}

export namespace DelayedVestingAccount {
  export interface Amino {
    type: 'cosmos-sdk/DelayedVestingAccount';
    value: {
      base_vesting_account: BaseVestingAccount.AminoValue;
    };
  }

  export interface Data {
    '@type': '/cosmos.vesting.v1beta1.DelayedVestingAccount';
    base_vesting_account: BaseVestingAccount.DataValue;
  }

  export type Proto = DelayedVestingAccount_pb;
}