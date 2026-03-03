describe('Upload/Paste E2E', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Tab navigation', () => {
    it('shows paste tab by default', () => {
      cy.get('[data-testid=paste-tab]').should('exist')
      cy.get('[data-testid=paste-textarea]').should('exist')
    })

    it('switches to editor tab', () => {
      cy.get('[data-testid=editor-tab]').click()
      cy.get('[data-testid=paste-textarea]').should('not.exist')
    })

    it('switches back to paste tab', () => {
      cy.get('[data-testid=editor-tab]').click()
      cy.get('[data-testid=paste-tab]').click()
      cy.get('[data-testid=paste-textarea]').should('exist')
    })
  })

  describe('Paste input', () => {
    it('shows validation error for empty paste', () => {
      cy.get('[data-testid=load-paste-btn]').click()
      cy.get('.formFeedbackError').should('exist')
    })

    it('shows validation error for paste exceeding max length', () => {
      const longPaste = 'a'.repeat(2049)
      cy.get('[data-testid=paste-textarea]').type(longPaste)
      cy.get('[data-testid=load-paste-btn]').click()
      cy.get('.formFeedbackError').should('exist')
    })

    it('loads example paste', () => {
      const examplePaste = `Arcanine @ Figy Berry
Ability: Intimidate
EVs: 252 Atk / 4 SpD / 252 Spe
Jolly Nature
- Flare Blitz
- Close Combat
- Extreme Speed
- Protect

Venusaur @ Focus Sash
Ability: Chlorophyll
EVs: 252 SpA / 4 SpD / 252 Spe
Modest Nature
IVs: 0 Atk
- Grass Pledge
- Sleep Powder
- Protect
- Sludge Bomb

Gyarados @ Sitrus Berry
Ability: Intimidate
EVs: 252 Atk / 4 SpD / 252 Spe
Jolly Nature
- Power Whip
- Water Spout
- Bounce
- Protect

Rhyperior @ Weakness Policy
Ability: Solid Rock
EVs: 252 HP / 4 Atk / 252 Def
Relaxed Nature
- Rock Slide
- Drill Run
- Fire Blast
- Protect

Machamp @ Assault Vest
Ability: No Guard
EVs: 248 HP / 252 Atk / 8 SpD
Adamant Nature
- Dynamic Punch
- Rock Slide
- Bullet Punch
- Poison Jab

Tyranitar @ Expert Belt
Ability: Sand Stream
EVs: 252 HP / 252 Atk / 4 SpD
Adamant Nature
- Crunch
- Rock Slide
- Protect
- Superpower`;

      cy.intercept('GET', '**/testdata/paste/testPaste', {
        statusCode: 200,
        body: examplePaste
      }).as('getTestPaste');

      cy.get('[data-testid=example-paste-btn]').click()

      cy.wait('@getTestPaste').its('response.statusCode').should('eq', 200);
      cy.get('[data-testid=paste-textarea]').should('not.have.value', '')
      cy.get('[data-testid=load-paste-btn]').click()
    })

    it('resets paste input', () => {
      cy.get('[data-testid=paste-textarea]').type('some text')
      cy.get('[data-testid=reset-paste-btn]').click()
      cy.get('[data-testid=paste-textarea]').should('have.value', '')
    })
  })
})
