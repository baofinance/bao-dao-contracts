import brownie
from lockfile import locked
from web3 import Web3
from tests.conftest import alice, locked_bao_eoa_1, locked_bao_eoa_2

H = 3600
DAY = 86400
WEEK = 7 * DAY
MAXTIME = 126144000


def test_create_lock_for(web3, chain, accounts, token, voting_escrow, bao_distribution):
    locked_bao_eoa_1, locked_bao_eoa_2 = accounts[:2]

    # ADDRESS -> 0x48b72465fed54964a9a0bb2fb95dbc89571604ec || "0x7c55d8a6ded3b13b342fc383df5bb934076f49a6598303ea68ea78ae4630d445","0xc27d9182b8a0059391b0b9ca0cd520eb8736edcbc31fb409171e1c0c86bb6b47", "0xbf0649842a7abec3aecd9067bb1565450eaee8774e9c1e28d4275abeef8ad9c0","0x45cb0fcc27fd4559bef5a821fec38dcf6f8c076fa52d688b3653fd3902e8a242","0xa17e5ebb128d4249fdf897c65851abe21350c52426c7c7935ef690f6754f5ced","0xca7d3efb93698e6d63e7b775d7bde2fab51d2b54bec39aaf9616689bd597d716","0x22259a0def7b4a34a9f696b57de8d5082416afad0fc9389bf13bad33400da8eb" "0xc9a6a2d0cc907edf49306c38f85c6b5563495ca17edc9dd94fbf7af6bdf57b39","0x8da8749519129e9950750cdc331c45fc2a2afafa32d7cb1c29cf4163c2518c15","0xb3b2fa4717a6ce8dfda614923c909fef4ec0f31867f9f6c9d6e62db4331cb098","0xac5cd164456811dcbaf2f5776ef203e571752a72f9d3448038372ea6f6b85eac","0xb9d7a9c91a83f031de3c12050ece30c8c0be1d18a05d8e4bb00d582933b41e9a","0xbd5c245a1020a83e5fd82a003737eaf52a7c285465a2fcd9d4eced16eb2dbd73"

    eoa_1_proof_arr = [ 0x7c55d8a6ded3b13b342fc383df5bb934076f49a6598303ea68ea78ae4630d445, 
                        0xc27d9182b8a0059391b0b9ca0cd520eb8736edcbc31fb409171e1c0c86bb6b47,
                        0xbf0649842a7abec3aecd9067bb1565450eaee8774e9c1e28d4275abeef8ad9c0,
                        0x45cb0fcc27fd4559bef5a821fec38dcf6f8c076fa52d688b3653fd3902e8a242,
                        0xa17e5ebb128d4249fdf897c65851abe21350c52426c7c7935ef690f6754f5ced,
                        0xca7d3efb93698e6d63e7b775d7bde2fab51d2b54bec39aaf9616689bd597d716,
                        0x22259a0def7b4a34a9f696b57de8d5082416afad0fc9389bf13bad33400da8eb,
                        0xc9a6a2d0cc907edf49306c38f85c6b5563495ca17edc9dd94fbf7af6bdf57b39,
                        0x8da8749519129e9950750cdc331c45fc2a2afafa32d7cb1c29cf4163c2518c15,
                        0xb3b2fa4717a6ce8dfda614923c909fef4ec0f31867f9f6c9d6e62db4331cb098,
                        0xac5cd164456811dcbaf2f5776ef203e571752a72f9d3448038372ea6f6b85eac,
                        0xb9d7a9c91a83f031de3c12050ece30c8c0be1d18a05d8e4bb00d582933b41e9a,
                        0xbd5c245a1020a83e5fd82a003737eaf52a7c285465a2fcd9d4eced16eb2dbd73 ]


    # ADDRESS -> 0x609991ca0ae39bc4eaf2669976237296d40c2f31 || "0x75a5df27f59d8f12b00fb0b5e99cb9a54a8e7bf1c11c77f7604ae3fcceb33778","0x0eb894e8ddfe6a3441a1711d4ce85460015898bcbc106f7ee81bdcaca983a2a3","0xcaaf22be08cee8c5b505ee13a1d72e1149c0f56a5be23b556fda68d086c40b28","0x42bfc44cd7808669acd3b29704661163f50450491510942850931ab16674cfe6","0x398e8d731b2ae955e94ad80f366af2ba20cac56a56c75449ad6a931943007e47","0x35f1f3bdf25b692b184ff9e371448ac106252dc68f74043643498d5a57630f55","0xe62c69e75837a33bc47aecf3d99c9d93859332a57b224004c50e5d7f830f7a95","0x59d9ec460946a700964a1639f669af18933abb9dcd80a72b833e746231dadb40","0x5eaa5caa85c1fc3b000da1dd71f06736b10d7c1c5ad8f727e71403fd1ade239c","0xb3b2fa4717a6ce8dfda614923c909fef4ec0f31867f9f6c9d6e62db4331cb098","0xac5cd164456811dcbaf2f5776ef203e571752a72f9d3448038372ea6f6b85eac","0xb9d7a9c91a83f031de3c12050ece30c8c0be1d18a05d8e4bb00d582933b41e9a","0xbd5c245a1020a83e5fd82a003737eaf52a7c285465a2fcd9d4eced16eb2dbd73"

    eoa_2_proof_arr = [ 0x75a5df27f59d8f12b00fb0b5e99cb9a54a8e7bf1c11c77f7604ae3fcceb33778, 
                        0x0eb894e8ddfe6a3441a1711d4ce85460015898bcbc106f7ee81bdcaca983a2a3,
                        0xcaaf22be08cee8c5b505ee13a1d72e1149c0f56a5be23b556fda68d086c40b28,
                        0x42bfc44cd7808669acd3b29704661163f50450491510942850931ab16674cfe6,
                        0x398e8d731b2ae955e94ad80f366af2ba20cac56a56c75449ad6a931943007e47,
                        0x35f1f3bdf25b692b184ff9e371448ac106252dc68f74043643498d5a57630f55,
                        0xe62c69e75837a33bc47aecf3d99c9d93859332a57b224004c50e5d7f830f7a95,
                        0x59d9ec460946a700964a1639f669af18933abb9dcd80a72b833e746231dadb40,
                        0x5eaa5caa85c1fc3b000da1dd71f06736b10d7c1c5ad8f727e71403fd1ade239c,
                        0xb3b2fa4717a6ce8dfda614923c909fef4ec0f31867f9f6c9d6e62db4331cb098,
                        0xac5cd164456811dcbaf2f5776ef203e571752a72f9d3448038372ea6f6b85eac,
                        0xb9d7a9c91a83f031de3c12050ece30c8c0be1d18a05d8e4bb00d582933b41e9a,
                        0xbd5c245a1020a83e5fd82a003737eaf52a7c285465a2fcd9d4eced16eb2dbd73 ]


    proof_arr_1 = []
    proof_arr_2 = []


    for x in range(0, len(eoa_1_proof_arr)):
        proof_arr_1.append(Web3.toHex(eoa_1_proof_arr[x]))

    for x in range(0, len(eoa_2_proof_arr)):
        proof_arr_2.append(Web3.toHex(eoa_2_proof_arr[x]))

    assert voting_escrow.totalSupply() == 0
    assert voting_escrow.balanceOf(locked_bao_eoa_1) == 0
    assert voting_escrow.balanceOf(locked_bao_eoa_2) == 0

    # Move to timing which is good for testing - beginning of a UTC week
    chain.sleep((chain[-1].timestamp // WEEK + 1) * WEEK - chain[-1].timestamp)
    chain.mine()
    chain.sleep(H)

    bao_distribution.startDistribution(eoa_1_proof_arr, 53669753833360467444414559923, {"from": locked_bao_eoa_1})
    bao_distribution.startDistribution(eoa_2_proof_arr, 44424944760825108606682818592, {"from": locked_bao_eoa_2})

    chain.sleep(H)

    bao_distribution.lockDistribution(94608000, {"from": locked_bao_eoa_1}) #lock for 3 years, minimum
    eoa1_starting_veBAO_bal = voting_escrow.balanceOf(locked_bao_eoa_1)

    assert voting_escrow.totalSupply() > 0 #eoa 1 lock makes veBAO supply increase from 0
    assert voting_escrow.balanceOf(locked_bao_eoa_1) > 0 #ve balance for locker is now > 0
    assert voting_escrow.balanceOf(locked_bao_eoa_1) == voting_escrow.totalSupply() # since only 1 lock exists total supply and eoa1 balance should be equal
    assert voting_escrow.balanceOf(bao_distribution) == 0 #distribution should never have a veBAO balance
    with brownie.reverts():
        bao_distribution.claimable(locked_bao_eoa_1, chain.time(), {"from": locked_bao_eoa_1}) #claimable for eoa 1 after lock should revert

    chain.sleep(52* WEEK) # fast forward 1 year

    eoa2_1st_claim_bal = bao_distribution.claimable(locked_bao_eoa_2, chain.time(), {"from": locked_bao_eoa_2})
    bao_distribution.claim({"from": locked_bao_eoa_2}) # eoa 2 claims from distribution contract, no lock

    chain.sleep(WEEK) # fast forward 1 week

    assert voting_escrow.totalSupply() == voting_escrow.balanceOf(locked_bao_eoa_1) # 1 lock exists, so total ve supply and that 1 lock balance should be equal
    assert bao_distribution.claimable(locked_bao_eoa_2, chain.time(), {"from": locked_bao_eoa_2}) < eoa2_1st_claim_bal # the amount available to claim should now be less after eoa 2 claims
    assert voting_escrow.balanceOf(locked_bao_eoa_1) < eoa1_starting_veBAO_bal # veBAO balance should linearly decay and eoa1's lock should reflect that

    before_eoa2_lock_supply = voting_escrow.totalSupply()
    bao_distribution.lockDistribution(4*365*86400, {"from": locked_bao_eoa_2}) #eoa2 lock for 4 years, Max
    eoa2_starting_veBAO_bal = voting_escrow.balanceOf(locked_bao_eoa_2)

    assert voting_escrow.totalSupply() > before_eoa2_lock_supply # the 2nd lock from eoa2 should make total ve supply increase
    assert voting_escrow.balanceOf(locked_bao_eoa_2) > 0 #ve balance for 2nd locker is now > 0
    assert (voting_escrow.balanceOf(locked_bao_eoa_1) + voting_escrow.balanceOf(locked_bao_eoa_2)) == voting_escrow.totalSupply() # 2 locks should = ve total
    assert voting_escrow.balanceOf(bao_distribution) == 0 #distribution should never have a veBAO balance
    with brownie.reverts():
        bao_distribution.claimable(locked_bao_eoa_1, chain.time(), {"from": locked_bao_eoa_1}) #claimable for eoa 2 after lock should revert

    chain.sleep(52*2*WEEK) #fast forward 2 years
    
    assert voting_escrow.balanceOf(locked_bao_eoa_2) < eoa2_starting_veBAO_bal # veBAO balance should linearly decay and eoa2's lock should reflect that
    assert voting_escrow.balanceOf(locked_bao_eoa_1) == 0 # time since eoa1's lock was created has exceeded 3 years/lock time
    assert voting_escrow.balanceOf(locked_bao_eoa_2) == voting_escrow.totalSupply() # 1 active lock now that eoa1 lock expired || ve total = eoa2 balanceOf

    chain.sleep(52*2*WEEK + WEEK) # 2 years + 1 Week

    assert voting_escrow.balanceOf(locked_bao_eoa_2) == 0 # eoa2 should be expired by this time
    assert voting_escrow.totalSupply() == 0 # there should be no more active locks
    

