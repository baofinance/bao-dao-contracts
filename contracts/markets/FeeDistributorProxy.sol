import "./SafeMath.sol";
import "./ERC20.sol";

pragma solidity ^0.5.16;

contract FeeDistributorProxy {
    using SafeMath for uint;

    address public admin;
    address public operator;

    uint public x;
    uint public y;
    uint public z;

    ERC20 public token;

    address public outputX = 0x3dCe48CfC0bEA704ec1640b34b33eC55F97D3056;
    address public outputY = 0x00000000000000000000000000000000DeaDBeef;
    address public outputZ = 0x00000000000000000000000000000000cafebabe;

    constructor(address _admin, ERC20 _token, uint _x, uint _y, uint _z) public {
        admin = _admin;
        token = _token;
        x = _x;
        y = _y;
        z = _z;
    }

    // Assertions {{{
    function _onlyAdmin() private {
        require(msg.sender == admin, "only admin");
    }

    function _onlyOperator() private {
        require(msg.sender == operator, "only operator");
    }

    function _validPercent(uint _p) private {
        require(_p <= 1000000000000000000, "percent too big");
    }
    // }}}

    // Set the address that can operate some of this function (less than admin).
    function setOperator(address _operator) external {
        _onlyAdmin();
        operator = _operator;
    }

    // Withdraw any amount of a token held by this contract to some address.
    function withdraw(ERC20 _token, address _output, uint _amount) public {
        _onlyAdmin();
        _token.transfer(_output, _amount);
    }

    // Withdraw *the full token balance* held by this contract to some address.
    function withdraw(ERC20 _token, address _output) external {
        uint balance = _token.balanceOf(address(this));
        withdraw(_token, _output, balance);
    }

    // Change the admin from the caller to someone else.
    function changeAdmin(address _admin) external {
        _onlyAdmin();
        admin = _admin;
    }

    function setPercentX(uint _x) external {
        _onlyAdmin();
        _validPercent(_x);
        x = _x;
    }

    function setPercentY(uint _y) external {
        _onlyAdmin();
        _validPercent(_y);
        y = _y;
    }

    function setPercentZ(uint _z) external {
        _onlyAdmin();
        _validPercent(_z);
        z = _z;
    }

    // Split a set amount of the held funds and send it.
    // x+y+z have to add up to "one" (1e18) before you call this.
    function splitFunds(uint _amount) public {
        _onlyOperator();
        require(x+y+z == 1000000000000000000, "x+y+z != 100%");
        require(_amount <= token.balanceOf(address(this)), "not enough funds");

        uint amountX = (_amount * x) / 10**18;
        uint amountY = (_amount * y) / 10**18;
        uint amountZ = (_amount * z) / 10**18;

        token.transfer(outputX, amountX);
        token.transfer(outputY, amountY);
        token.transfer(outputZ, amountZ);
    }

    // Split the entire amount of held funds up.
    function splitFunds() external {
        uint fullBalance = token.balanceOf(address(this));
        splitFunds(fullBalance);
    }
}
