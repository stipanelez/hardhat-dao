// SPDX-License-Identifier: MIT

//We are going to make erc20 token and extend it to make it governance
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

//allows approvals to be made via signatures
// you can sign transaction and someother can send transaction

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

import {ERC20Votes} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import {Nonces} from "@openzeppelin/contracts/utils/Nonces.sol";

//Snapshot of tokens people have at a certain block
//To avoid people to jump in and jump out once a proposal hits
//keeps a history of each account voting power-we dont use current balance
//give voting power of out token to some else
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract GovernanceToken is ERC20, ERC20Permit, ERC20Votes {
    uint256 public s_maxSupply = 1000000000000000000000000;

    //Inherite constructor from other contract
    //This token we are using for governance
    constructor() ERC20("MyGovToken", "MGT") ERC20Permit("MyGovToken") {
        _mint(msg.sender, s_maxSupply);
    }

    // The functions below are overrides required by Solidity.

    //every time when we transfer token,we want to make sure tath we call update
    //We want to be sure that shapshots are updated right
    //we want to know how many people have how many tokens at each block
    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Votes) {
        super._update(from, to, amount);
    }

    /*The nonces function is used to get the current nonce value for a given address. When a new signed message is created, 
the nonce is incremented to prevent reusing the same signed message.*/

    function nonces(
        address owner
    ) public view virtual override(ERC20Permit, Nonces) returns (uint256) {
        return super.nonces(owner);
    }
}
