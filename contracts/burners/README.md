# bao-dao-contracts/contracts/burners

All contracts used in the burning/conversion of fees to baoUSD, that will then be sent to the [`FeeDistributor`](../FeeDistributor.vy) contract

* [`BaseBurner`](BaseBurner.vy): Burn fees into baoUSD if they are not already baoUSD, then send those fees to the fee distributor
* [`UniswapBurner`](UniswapBurner.vy): Burn/convert fees recevived into this contract using any UNIv2 or SUSHIv2 LP pools to make swaps into DAI, then send converted DAI to the Base Burner to be converted into baoUSD (currently not in use)