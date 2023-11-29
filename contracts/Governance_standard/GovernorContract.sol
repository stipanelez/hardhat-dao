// SPDX-License-Identifier: MIT

//System which manage votes
//Cointains all function for proposing,executing,queuing
pragma solidity ^0.8.20;

//keeps mapping of proposals
//this is base contract
import "@openzeppelin/contracts/governance/Governor.sol";

//some settings
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";

//against,for,abstain
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";

//read the voting weight from token's built
//wat to integrate with erc20 contract
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";

//The GovernorVotesQuorumFraction is a fraction that represents the minimum number of votes needed to approve a proposal on the Governor contract.
//The quorum fraction is represented as a numerator divided by a denominator.
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";

//if DAO votes on something that a lot of people in DAO hate ,it gives a time to leave DAO
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";

contract GovernorContract is
    Governor,
    GovernorSettings,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorVotesQuorumFraction,
    GovernorTimelockControl
{
    constructor(
        IVotes _token,
        TimelockController _timelock,
        uint48 _votingDelay,
        uint32 _votingPeriod,
        uint256 _quorumPercentage
    )
        Governor("MyGovernor")
        GovernorSettings(_votingDelay, _votingPeriod, 0)
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(_quorumPercentage)
        GovernorTimelockControl(_timelock)
    {}

    // The following functions are overrides required by Solidity.

    function votingDelay()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.votingDelay();
    }

    function votingPeriod()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.votingPeriod();
    }

    function quorum(
        uint256 blockNumber
    )
        public
        view
        override(Governor, GovernorVotesQuorumFraction)
        returns (uint256)
    {
        return super.quorum(blockNumber);
    }

    function state(
        uint256 proposalId
    )
        public
        view
        override(Governor, GovernorTimelockControl)
        returns (ProposalState)
    {
        return super.state(proposalId);
    }

    function proposalNeedsQueuing(
        uint256 proposalId
    ) public view override(Governor, GovernorTimelockControl) returns (bool) {
        return super.proposalNeedsQueuing(proposalId);
    }

    function proposalThreshold()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.proposalThreshold();
    }

    function _queueOperations(
        uint256 proposalId,
        address[] memory targets, //list of different contracts to make a transaction to
        uint256[] memory values, //list of values to send with each Target
        bytes[] memory calldatas, //bytes data that send with each transaction
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) returns (uint48) {
        return
            super._queueOperations(
                proposalId,
                targets,
                values,
                calldatas,
                descriptionHash
            );
    }

    function _executeOperations(
        uint256 proposalId,
        address[] memory targets, // which contract
        uint256[] memory values, //how much ethers
        bytes[] memory calldatas, //encoded paramaters for function
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) {
        super._executeOperations(
            proposalId,
            targets,
            values,
            calldatas,
            descriptionHash
        );
    }

    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) returns (uint256) {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function _executor()
        internal
        view
        override(Governor, GovernorTimelockControl)
        returns (address)
    {
        return super._executor();
    }
}
