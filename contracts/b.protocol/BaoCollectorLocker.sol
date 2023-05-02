import "../IERC20BAO.sol";

interface VEBao {
    function balanceOf(address _addr) external view returns(uint256);
    function create_lock_for(address _to, uint256 _value, uint256 _unlock_time) external;
}

contract BaoCollecterLocker {
    IERC20BAO bao;
    VEBao veBao;
    address lockForUser;

    constructor(address _bao, address _veBao, address _lockForUser) {
        lockForUser = _lockForUser;
        bao = IERC20BAO(_bao);
        veBao = VEBao(_veBao);
    }

    function setUser(address _lockForUser) external {
        require(msg.sender == lockForUser, "not the right account");
        lockForUser = _lockForUser;
    }

    function lockBaoForUser() external {
        require(msg.sender == lockForUser, "not the right account");
        uint256 amount = bao.balanceOf(address(this));
        bao.approve(address(veBao), amount);
        veBao.create_lock_for(lockForUser, amount, getFutureUnlockTime());
    }

    function getFutureUnlockTime() public view returns(uint256 time){
        return block.timestamp + 365 days;
    }
}
