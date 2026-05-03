context('Accessibility', () => {
  [
    { title: 'Home', url: '/' },
    { title: 'Behandelingen', url: '/behandelingen' },
    { title: 'ACT', url: '/behandelingen/acceptance-and-commitment-therapy' },
    { title: 'CGT', url: '/behandelingen/cognitieve-gedragstherapie' },
    { title: 'eHealth', url: '/behandelingen/e-health' },
    { title: 'EMDR', url: '/behandelingen/emdr' },
    { title: 'De praktijk', url: '/de-praktijk' },
  ].forEach((page) => {
    describe(page.title, () => {
      before(() => {
        cy.visit(page.url);
        cy.injectAxe();
      });

      it('all accessibility tests', () => {
        cy.checkA11y(undefined, undefined, (violations) => {
          violations.forEach((v) => {
            cy.task('log', `\n[${v.impact}] ${v.id}: ${v.description}`);
            v.nodes.forEach((n) => {
              cy.task('log', `  at: ${n.target.join(' ')}`);
              cy.task('log', `    ${n.failureSummary}`);
            });
          });
        });
      });
    });
  });
});
