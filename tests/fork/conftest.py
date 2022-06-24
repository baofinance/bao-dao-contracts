import pytest
from brownie_tokens import MintableForkToken


class _MintableTestToken(MintableForkToken):
    def __init__(self, address):
        super().__init__(address)


@pytest.fixture(scope="session")
def MintableTestToken():
    yield _MintableTestToken


@pytest.fixture(scope="module")
def DAI():
    yield _MintableTestToken("0x6B175474E89094C44Da98b954EedeAC495271d0F")


@pytest.fixture(scope="module")
def BaoUSD():
    yield _MintableTestToken("0x7945b0A6674b175695e5d1D08aE1e6F13744Abb0")