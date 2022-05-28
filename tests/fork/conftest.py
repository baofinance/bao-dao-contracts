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
def USDC():
    yield _MintableTestToken("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48")