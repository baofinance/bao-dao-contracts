import brownie


def test_set_minter_admin_only(accounts, token):
    with brownie.reverts():
       token.set_minter(accounts[2], {"from": accounts[1]})


def test_set_admin_admin_only(accounts, token):
    with brownie.reverts():
        token.set_admin(accounts[2], {"from": accounts[1]})


def test_set_minter(accounts, token):
    token.set_minter(accounts[1], {"from": accounts[0]})

    assert token.minter() == accounts[1]


def test_set_admin(accounts, token):
    token.set_admin(accounts[1], {"from": accounts[0]})

    assert token.admin() == accounts[1]
