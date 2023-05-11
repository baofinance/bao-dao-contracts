// SPDX-License-Identifier: MIT

import "./IERC20.sol";

pragma solidity 0.8.19;

error InvalidPercentages();
error AddressZero();
error NotEnoughFunds();

contract FeeDistributorProxy {

    address public admin; // Address of the admin
    address public operator; // Address of the operator

    uint public percentX; // Percentage of funds to distribute to address X
    uint public percentY; // Percentage of funds to distribute to address Y
    uint public percentZ; // Percentage of funds to distribute to address Z

    IERC20 public token; // The token to be distributed

    address public immutable recipientX = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266; // Address of recipient X
    address public immutable recipientY = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8; // Address of recipient Y
    address public immutable recipientZ = 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC; // Address of recipient Z


    /// @param _admin The admin address
    /// @param _operator The operator address
    /// @param _token The token to be distributed
    /// @param _percentX The percentage of funds to distribute to address X
    /// @param _percentY The percentage of funds to distribute to address Y
    /// @param _percentZ The percentage of funds to distribute to address Z
    constructor(address _admin, address _operator, IERC20 _token, uint _percentX, uint _percentY, uint _percentZ) public {
        // ensure percentages do not exceed 100%
        if ((_percentX + _percentY + _percentZ) != 1_000_000_000_000_000_000) {
            revert InvalidPercentages();
        }

        if (_admin == address(0) || address(_token) == address(0) || _operator == address(0)){
            revert AddressZero();
        }

        admin = _admin;
        token = _token;
        operator = _operator;

        percentX = _percentX;
        percentY = _percentY;
        percentZ = _percentZ;
    }

    /**
    * @dev Require that the caller is the admin.
    */
    modifier onlyAdmin() {
        require(msg.sender == admin, "only admin");
        _;
    }

    /**
    * @dev Require that the caller is the operator.
    */
    modifier onlyOperator() {
        require(msg.sender == operator, "only operator");
        _;
    }

    /**
    * @dev Withdraws an amount of a token held by this contract to a specified address.
    * @param _token The token to withdraw.
    * @param _output The address to receive the withdrawn tokens.
    * @param _amount The amount of tokens to withdraw.
    */
    function withdrawSome(IERC20 _token, address _output, uint _amount) external onlyAdmin {
        _withdraw(_token, _output, _amount);
    }

    /**
    * @dev Withdraws the full token balance held by this contract to a specified address.
    * @param _token The token to withdraw.
    * @param _output The address to receive the withdrawn tokens.
     */
    function withdrawAll(IERC20 _token, address _output) external onlyAdmin {
        uint256 _balance = _token.balanceOf(address(this));
        _withdraw(_token, _output, _balance);
    }

    /**
    * @dev Internal function to withdraw an amount of tokens held by this contract to a specified address.
    * @param _token The token to withdraw.
    * @param _output The address to receive the withdrawn tokens.
    * @param _amount The amount of tokens to withdraw.
    */
    function _withdraw(IERC20 _token, address _output, uint _amount) internal {
        _token.transfer(_output, _amount);
    }

    /**
    * @dev Sets the admin address.
    * @param _admin The new admin address.
    */
    function setAdmin(address _admin) external onlyAdmin {
        admin = _admin;
    }

    /**
    * @dev Sets the operator address.
    * @param _operator The new operator address.
    */
    function setOperator(address _operator) external onlyAdmin {
        operator = _operator;
    }

    /**
    * @dev Sets the percentage amounts for distribution.
    * @param _percentX The percentage of funds to distribute to address X.
    * @param _percentY The percentage of funds to distribute to address Y.
    * @param _percentZ The percentage of funds to distribute to address Z.
    */
    function setPercentAmounts(uint _percentX, uint _percentY, uint _percentZ) external onlyAdmin {
        // ensure percentages do not exceed 100%
        if ((_percentX + _percentY + _percentZ) != 1_000_000_000_000_000_000) {
            revert InvalidPercentages();
        }
        percentX = _percentX;
        percentY = _percentY;
        percentZ = _percentZ;
    }

    /**
    * @dev Splits the specified amount of funds among the recipients based on their percentages.
    * @param _amount The amount of funds to split.
    */
    function splitFunds(uint _amount) public onlyOperator {
        if (_amount <= token.balanceOf(address(this))) {
            revert NotEnoughFunds();
        }
        _splitFunds(_amount);
    }

    /**
    * @dev Splits the entire amount of held funds among the recipients based on their percentages.
    */
    function splitAllFunds() external onlyOperator {
        uint _balance = token.balanceOf(address(this));
        _splitFunds(_balance);
    }

    /**
    * @dev Internal function to split the specified amount of funds among the recipients based on their percentages.
    * @param _amount The amount of funds to split.
    */
    function _splitFunds(uint _amount) internal {
        uint _amountX = (_amount * percentX) / 1 ether;
        uint _amountY = (_amount * percentY) / 1 ether;
        uint _amountZ = (_amount * percentZ) / 1 ether;

        token.transfer(recipientX, _amountX);
        token.transfer(recipientY, _amountY);
        token.transfer(recipientZ, _amountZ);
    }
}
