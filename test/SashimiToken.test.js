const { expectRevert } = require('@openzeppelin/test-helpers');
const SashimiToken = artifacts.require('SashimiToken');

contract('SashimiToken', ([alice, bob, carol]) => {
    beforeEach(async () => {
        this.sashimi = await SashimiToken.new({ from: alice });
    });

    it('should have correct name and symbol and decimal', async () => {
        const name = await this.sashimi.name();
        const symbol = await this.sashimi.symbol();
        const decimals = await this.sashimi.decimals();
        assert.equal(name.valueOf(), 'SashimiToken');
        assert.equal(symbol.valueOf(), 'SASHIMI');
        assert.equal(decimals.valueOf(), '18');
    });

    it('should only allow owner to mint token', async () => {
        await this.sashimi.mint(alice, '100', { from: alice });
        await this.sashimi.mint(bob, '1000', { from: alice });
        await expectRevert(
            this.sashimi.mint(carol, '1000', { from: bob }),
            'Ownable: caller is not the owner',
        );
        const totalSupply = await this.sashimi.totalSupply();
        const aliceBal = await this.sashimi.balanceOf(alice);
        const bobBal = await this.sashimi.balanceOf(bob);
        const carolBal = await this.sashimi.balanceOf(carol);
        assert.equal(totalSupply.valueOf(), '1100');
        assert.equal(aliceBal.valueOf(), '100');
        assert.equal(bobBal.valueOf(), '1000');
        assert.equal(carolBal.valueOf(), '0');
    });

    it('should supply token transfers properly', async () => {
        await this.sashimi.mint(alice, '100', { from: alice });
        await this.sashimi.mint(bob, '1000', { from: alice });
        await this.sashimi.transfer(carol, '10', { from: alice });
        await this.sashimi.transfer(carol, '100', { from: bob });
        const totalSupply = await this.sashimi.totalSupply();
        const aliceBal = await this.sashimi.balanceOf(alice);
        const bobBal = await this.sashimi.balanceOf(bob);
        const carolBal = await this.sashimi.balanceOf(carol);
        assert.equal(totalSupply.valueOf(), '1100');
        assert.equal(aliceBal.valueOf(), '90');
        assert.equal(bobBal.valueOf(), '900');
        assert.equal(carolBal.valueOf(), '110');
    });

    it('should fail if you try to do bad transfers', async () => {
        await this.sashimi.mint(alice, '100', { from: alice });
        await expectRevert(
            this.sashimi.transfer(carol, '110', { from: alice }),
            'ERC20: transfer amount exceeds balance',
        );
        await expectRevert(
            this.sashimi.transfer(carol, '1', { from: bob }),
            'ERC20: transfer amount exceeds balance',
        );
    });
  });
