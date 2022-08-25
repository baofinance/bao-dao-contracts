import brownie

H = 3600
DAY = 86400
WEEK = 7 * DAY
MAXTIME = 126144000


def test_lock_distr(web3, chain, accounts, token, voting_escrow, bao_distribution):
    # locked_bao_eoa_1, locked_bao_eoa_2 = accounts[:2]
    eoa1 = 100
    eoa2 = 101
    eoa1Amount = 53669753833360467444414559923
    eoa2Amount = 44599721927768192099018289499

    accounts[98].transfer(accounts[eoa1], "100 ether")
    accounts[99].transfer(accounts[eoa2], "100 ether")

    # ADDRESS ->  

    eoa_1_proof_arr = [ 0x7c55d8a6ded3b13b342fc383df5bb934076f49a6598303ea68ea78ae4630d445,
                        0x44db9ee999de8b628c5de2592b347008ebd4e77b94f4ef1d121a4aca6e8e8d51,
                        0xb6a829733a6f85d368893b416f8a967e2189681368d3788134eee3c5bf22e976,
                        0xb0232903c4ba9256861d60a6ca9d933cb8db387d8a6cecc1cbc178e5d91eacf5,
                        0x7643968dd707041b7737a52d1fee41fe8ee37ada29585e37b92a090cb91ae86a,
                        0x3c0d2d3a207e8e01f4c7442bfa1adbfd25ba072c213bc8406a182fb61cb78401,
                        0x0afca7cc1288693408e2857ddec8b2b4dea74215f0b9219421773ab0b31b8a11,
                        0x8310cf070515dcb50f13259a1f5cf52c6bd7db2f3004525eaf17c6335ccd333c,
                        0xbe44074166d23ae6832865be9972f4f3776a903e1a5e9e2c1780313fe629dfa3,
                        0xbaba52a8a741481583014f906912d7870d53fd776fb6529ec6fca8af2b6877d0,
                        0x74e8548f3229e22c31e75e2f80ac2757237cc8b435d3658438927bfa891b9763,
                        0x9d7ff74eec600ac6ffe42f02d4ae6b16219c714e02a535e853850ba9e7677878,
                        0x4b7feb1f0234422835771be9152c527c22a60ca378ce2fc7f350c1aa8e115032 ]


    # ADDRESS -> 0x609991ca0ae39bc4eaf2669976237296d40c2f31 

    eoa_2_proof_arr = [ 0x61120ad1ad69e9dd4a8d0e4d2d72006872704ad09437e8b1124c6c6fd4cbcc62,
                        0xf16a00483fdd6b232b1f8dc1d38f2d7736f6326fb498207fadd565a15ac799c6,
                        0xf72e7bd6f83b1718aebfd662c53f91d4d725f3a3a64dce05fa79a5cd4087c0a2,
                        0xeb1b599fcd9f71c9248aff66751e0b491a8cf782e043f8120dc0793afe48ac54,
                        0xed8b77dc630a5538c387930f522ab42202582fa0c0f899cebb17504eb31a28ac,
                        0x33f6a6cd5c4266276c16d988bf0ae11a5665832a4edeec1e4421148b7a3224a8,
                        0x978e16008e26fc2e5f05d2416a29a90b9ef351adbf3c45f5bd905d91ecbac340,
                        0x91c2521e2283a0671b6bfd8b3d0b042484750c7e8a44f4a828b14a4efca87c8d,
                        0xcad3ba78a0da6131dd8a1ad22c81b15f85cc327a86317372f465361afcb2f34a,
                        0x9590cb84d66eed07dd9556fbc7ba6aae3f1864bd0db0a704c40a2b11489f8464,
                        0x56c84b5ef64065935078154d1631bda16d44c06db4abd19aac7bd420feccaab2,
                        0x9d7ff74eec600ac6ffe42f02d4ae6b16219c714e02a535e853850ba9e7677878,
                        0x4b7feb1f0234422835771be9152c527c22a60ca378ce2fc7f350c1aa8e115032 ]

    token.transfer(bao_distribution, 15e26, {"from": accounts[0]})

    assert token.balanceOf(accounts[0]) == 0
    assert token.balanceOf(bao_distribution.address) == 15e26
    assert voting_escrow.totalSupply() == 0
    assert voting_escrow.balanceOf(accounts[eoa1]) == 0
    assert voting_escrow.balanceOf(accounts[eoa2]) == 0

    voting_escrow.commit_distr_contract(bao_distribution, {"from": accounts[0]})
    voting_escrow.apply_distr_contract({"from": accounts[0]})

    print(bao_distribution.address)
    print(bao_distribution.treasury())

    bao_distribution.startDistribution(eoa_1_proof_arr, 53669753833360467444414559923, {"from": accounts[eoa1]})
    bao_distribution.startDistribution(eoa_2_proof_arr, 44599721927768192099018289499, {"from": accounts[eoa2]})

    chain.mine()
    chain.sleep(WEEK)

    bao_distribution.claim({"from": accounts[eoa1]})

    print(bao_distribution.claimable(accounts[eoa1], chain.time(), {"from": accounts[eoa1]}))
    print(token.balanceOf(bao_distribution.address))

    chain.sleep(52*WEEK)

    # Will revert cuz of BROWNIEEEEEEEE ENVIRONMENTTTT ERRRROOOORRSSS, I have no idea
    bao_distribution.lockDistribution((chain.time() + 3*365*86400 + WEEK), {"from": accounts[eoa1]}) #lock for 3 years, minimum