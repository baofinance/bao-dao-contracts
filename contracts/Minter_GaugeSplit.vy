# @version 0.2.4
"""
@title Token Minter - Gauge Split
@author Curve Finance
@license MIT
"""

interface LiquidityGauge:
    # Presumably, other gauges will provide the same interfaces
    def integrate_fraction(addr: address) -> uint256: view
    def user_checkpoint(addr: address) -> bool: nonpayable

interface MERC20:
    def mint(_to: address, _value: uint256) -> bool: nonpayable

interface GaugeController:
    def gauge_types(addr: address) -> int128: view


event Minted:
    recipient: indexed(address)
    gauge: address
    minted: uint256


token: public(address)
controller: public(address)

# user -> gauge -> value
minted: public(HashMap[address, HashMap[address, uint256]])

# minter -> user -> can mint?
allowed_to_mint_for: public(HashMap[address, HashMap[address, bool]])

struct GaugeSplit:
    percentage: uint256
    output: address

# gauge address -> (amount to split off, place to send it)
split_gauges: public(HashMap[address, GaugeSplit])

admin: public(address)  # Can and will be a smart contract


@external
def __init__(_token: address, _controller: address):
    self.token = _token
    self.controller = _controller
    self.admin = msg.sender


@external
def transfer_ownership(_admin: address):
    """
    @notice Transfer contract ownership to a new address.
    """
    assert msg.sender == self.admin
    assert _admin != ZERO_ADDRESS
    self.admin = _admin


@internal
def _mint_for(gauge_addr: address, _for: address):
    assert GaugeController(self.controller).gauge_types(gauge_addr) >= 0  # dev: gauge is not added

    LiquidityGauge(gauge_addr).user_checkpoint(_for)
    total_mint: uint256 = LiquidityGauge(gauge_addr).integrate_fraction(_for)
    to_mint: uint256 = total_mint - self.minted[_for][gauge_addr]

    if to_mint != 0:
        if self.split_gauges[gauge_addr].output != ZERO_ADDRESS:
            sg: GaugeSplit = self.split_gauges[gauge_addr]
            split_mint_extra: uint256 = (to_mint * sg.percentage) / 10**18
            split_mint_user: uint256 = to_mint - split_mint_extra
            MERC20(self.token).mint(_for, split_mint_user)
            MERC20(self.token).mint(sg.output, split_mint_extra)
        else:
            MERC20(self.token).mint(_for, to_mint)

        self.minted[_for][gauge_addr] = total_mint
        log Minted(_for, gauge_addr, total_mint)


#@internal
#def _mint_for(gauge_addr: address, _for: address):
#    assert GaugeController(self.controller).gauge_types(gauge_addr) >= 0  # dev: gauge is not added
#
#    LiquidityGauge(gauge_addr).user_checkpoint(_for)
#    total_mint: uint256 = LiquidityGauge(gauge_addr).integrate_fraction(_for)
#    to_mint: uint256 = total_mint - self.minted[_for][gauge_addr]
#
#    if to_mint != 0:
#        if self.split_gauges[gauge_addr].output != ZERO_ADDRESS:
#            sg: GaugeSplit = self.split_gauges[gauge_addr]
#            split_mint_gauge: uint256 = (to_mint * sg.percentage) / 10**18
#            total_mint_gauge: uint256 = (total_mint * sg.percentage) / 10**18
#            MERC20(self.token).mint(sg.output, split_mint_gauge)
#            self.minted[sg.output][gauge_addr] = total_mint_gauge
#            log Minted(sg.output, gauge_addr, total_mint_gauge)
#            split_mint_user: uint256 = to_mint - split_mint_gauge
#            total_mint_user: uint256 = total_mint - total_mint_gauge
#            MERC20(self.token).mint(_for, split_mint_user)
#            self.minted[_for][gauge_addr] = total_mint_user
#            log Minted(_for, gauge_addr, total_mint_user)
#        else:
#            MERC20(self.token).mint(_for, to_mint)
#            self.minted[_for][gauge_addr] = total_mint
#            log Minted(_for, gauge_addr, total_mint)


@external
@nonreentrant('lock')
def mint(gauge_addr: address):
    """
    @notice Mint everything which belongs to `msg.sender` and send to them
    @param gauge_addr `LiquidityGauge` address to get mintable amount from
    """
    self._mint_for(gauge_addr, msg.sender)


@external
@nonreentrant('lock')
def mint_many(gauge_addrs: address[8]):
    """
    @notice Mint everything which belongs to `msg.sender` across multiple gauges
    @param gauge_addrs List of `LiquidityGauge` addresses
    """
    for i in range(8):
        if gauge_addrs[i] == ZERO_ADDRESS:
            break
        self._mint_for(gauge_addrs[i], msg.sender)


@external
@nonreentrant('lock')
def mint_for(gauge_addr: address, _for: address):
    """
    @notice Mint tokens for `_for`
    @dev Only possible when `msg.sender` has been approved via `toggle_approve_mint`
    @param gauge_addr `LiquidityGauge` address to get mintable amount from
    @param _for Address to mint to
    """
    if self.allowed_to_mint_for[msg.sender][_for]:
        self._mint_for(gauge_addr, _for)


@external
def toggle_approve_mint(minting_user: address):
    """
    @notice allow `minting_user` to mint for `msg.sender`
    @param minting_user Address to toggle permission for
    """
    self.allowed_to_mint_for[minting_user][msg.sender] = not self.allowed_to_mint_for[minting_user][msg.sender]

@external
def add_split_gauge(gauge_addr: address, output_addr: address, percentage: uint256):
    """
    @notice allow tokens to be split during mint from a gauge to another address
    @param gauge_addr Address of gauge that will have its emissions split off
    @param output_addr Location the split will be sent
    @param percentage percentage The amount to split
    """
    assert msg.sender == self.admin
    #assert percentage > 0 and percentage <= 1000000000000000000
    self.split_gauges[gauge_addr] = GaugeSplit({percentage: percentage, output: output_addr})
