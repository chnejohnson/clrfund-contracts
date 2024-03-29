import { BigNumber, Contract } from "ethers"
import { TransactionResponse } from "@ethersproject/abstract-provider"

export async function getGasUsage(transaction: TransactionResponse): Promise<number> {
  const receipt = await transaction.wait()
  return receipt.gasUsed.toNumber()
}

export async function getTxFee(transaction: TransactionResponse): Promise<BigNumber> {
  const receipt = await transaction.wait()
  return receipt.gasUsed.mul(transaction.gasPrice!)
}

export async function getEventArg(
  transaction: TransactionResponse,
  contract: Contract,
  eventName: string,
  argumentName: string,
): Promise<any> {
  const receipt = await transaction.wait()
  for (const log of receipt.logs || []) {
    if (log.address != contract.address) {
      continue
    }
    const event = contract.interface.parseLog(log)
    if (event && event.name === eventName) {
      return event.args[argumentName]
    }
  }
  throw new Error("Event not found")
}
