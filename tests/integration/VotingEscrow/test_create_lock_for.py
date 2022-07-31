
H = 3600
DAY = 86400
WEEK = 7 * DAY # 604,800
YEAR = 52 * WEEK # 31,536,000
MINTIME = 3 * YEAR # 94,608,000
MAXTIME = 126144000 # 126,144,000
TOL = 120 / WEEK


def test_create_lock_for(web3, chain, accounts, token, voting_escrow, bao_distribution):
    
    alice, bob = accounts[:2]
    amount = 1000 * 10 ** 18
    token.transfer(bao_distribution, amount, {"from": alice})
    stages = {}

    token.approve(voting_escrow.address, amount * 10, {"from": alice})
    token.approve(voting_escrow.address, amount * 10, {"from": bao_distribution})

    voting_escrow.commit_distr_contract(bao_distribution)
    voting_escrow.apply_distr_contract()

    assert voting_escrow.totalSupply() == 0
    assert voting_escrow.balanceOf(alice) == 0

    # Move to timing which is good for testing - beginning of a UTC week
    chain.sleep((chain[-1].timestamp // WEEK + 1) * WEEK - chain[-1].timestamp)
    chain.mine()

    chain.sleep(H)

    stages["before_deposits"] = (web3.eth.block_number, chain[-1].timestamp)

    voting_escrow.create_lock_for(alice, amount, chain[-1].timestamp + MINTIME, {"from": bao_distribution})
    stages["alice_deposit"] = (web3.eth.block_number, chain[-1].timestamp)

    chain.sleep(H)
    chain.mine()

    assert voting_escrow.totalSupply() > 0
    assert voting_escrow.balanceOf(alice) > 0
    assert voting_escrow.balanceOf(alice) == voting_escrow.totalSupply()
    assert voting_escrow.balanceOf(bao_distribution) == 0