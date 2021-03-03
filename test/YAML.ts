
interface GetYAMLType {
    tokenAddress: string;
    governanceAddress: string;
    timelockAddress: string;
  };

export const getYAML = ({
    tokenAddress,
    governanceAddress,
    timelockAddress,
  }: GetYAMLType): string => {
    return `
    specVersion: 0.0.2
    schema:
      file: ./schema.graphql
    dataSources:
    # ====================================== Token =======================================
      - kind: ethereum/contract
        name: Token
        network: mainnet
        source:
          address: "${tokenAddress}"
          abi: Token
        mapping:
          kind: ethereum/events
          apiVersion: 0.0.4
          language: wasm/assemblyscript
          entities:
            - Approval
            - DelegateChanged
            - DelegateVotesChanged
            - Transfer
          abis:
            - name: Token
              file: ./abis/CompoundToken.json
          eventHandlers:
            - event: Approval(indexed address,indexed address,uint256)
              handler: handleApproval
            - event: DelegateChanged(indexed address,indexed address,indexed address)
              handler: handleDelegateChanged
            - event: DelegateVotesChanged(indexed address,uint256,uint256)
              handler: handleDelegateVotesChanged
            - event: Transfer(indexed address,indexed address,uint256)
              handler: handleTransfer
          file: ./src/mappings.ts
    # ====================================== Governance ==================================  
      - kind: ethereum/contract
        name: GovernorAlpha
        network: mainnet
        source:
          address: "${governanceAddress}"
          abi: GovernorAlpha
        mapping:
          kind: ethereum/events
          apiVersion: 0.0.4
          language: wasm/assemblyscript
          entities:
            - ProposalCanceled
            - ProposalCreated
            - ProposalExecuted
            - ProposalQueued
            - VoteCast
          abis:
            - name: GovernorAlpha
              file: ./abis/GovernorAlpha.json
          eventHandlers:
            - event: ProposalCanceled(uint256)
              handler: handleProposalCanceled
            - event: ProposalCreated(uint256,address,address[],uint256[],string[],bytes[],uint256,uint256,string)
              handler: handleProposalCreated
            - event: ProposalExecuted(uint256)
              handler: handleProposalExecuted
            - event: ProposalQueued(uint256,uint256)
              handler: handleProposalQueued
            - event: VoteCast(address,uint256,bool,uint256)
              handler: handleVoteCast
          file: ./src/mappings.ts
    # ====================================== Timelock ====================================  
      - kind: ethereum/contract
        name: Timelock
        network: mainnet
        source:
          address: "${timelockAddress}"
          abi: Timelock
        mapping:
          kind: ethereum/events
          apiVersion: 0.0.4
          language: wasm/assemblyscript
          entities:
            - NewAdmin
            - NewPendingAdmin
            - NewDelay
            - CancelTransaction
            - ExecuteTransaction
            - QueueTransaction
          abis:
            - name: Timelock
              file: ./abis/Timelock.json
          eventHandlers:
            - event: NewAdmin(indexed address)
              handler: handleNewAdmin
            - event: NewPendingAdmin(indexed address)
              handler: handleNewPendingAdmin
            - event: NewDelay(indexed uint256)
              handler: handleNewDelay
            - event: CancelTransaction(indexed bytes32,indexed address,uint256,string,bytes,uint256)
              handler: handleCancelTransaction
            - event: ExecuteTransaction(indexed bytes32,indexed address,uint256,string,bytes,uint256)
              handler: handleExecuteTransaction
            - event: QueueTransaction(indexed bytes32,indexed address,uint256,string,bytes,uint256)
              handler: handleQueueTransaction
          file: ./src/mappings.ts
  
            
  `;
  };
  