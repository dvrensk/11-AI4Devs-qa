/// <reference types="cypress" />

describe('Position Details Page', () => {
    beforeEach(() => {
        // Reset database once before the test
        cy.task('resetDatabase');

        // Visit the positions page
        cy.visit('/positions');

        // Click on the first "Ver proceso" button without checking if it exists
        cy.contains('Ver proceso').first().click();
    });

    it('should verify position details page functionality', () => {
        // 1. Verify the position title is displayed correctly
        cy.get('h2.text-center.mb-4').should('be.visible');
        cy.get('h2.text-center.mb-4').should('contain', 'Senior Full-Stack Engineer');

        // 2. Verify columns for each phase of the hiring process
        cy.get('.card-header').should('be.visible');
        cy.get('.card-header').should('have.length.at.least', 3);

        // Verify specific column titles match expected phases
        cy.get('.card-header').eq(0).should('contain', 'Initial Screening');
        cy.get('.card-header').eq(1).should('contain', 'Technical Interview');
        cy.get('.card-header').eq(2).should('contain', 'Manager Interview');

        // 3. Verify specific candidate names in columns
        // Check Initial Screening column for Carlos García
        cy.get('.card-header').eq(0).parent().find('.card-body .card .card-title')
            .should('contain', 'Carlos García');

        // Check Technical Interview column for Jane Smith and John Doe
        cy.get('.card-header').eq(1).parent().find('.card-body .card .card-title')
            .then(($candidates) => {
                expect($candidates.text()).to.include('Jane Smith');
                expect($candidates.text()).to.include('John Doe');
            });

        // 4. Verify candidate details view
        // Click on the first candidate card
        cy.get('.card-body .card').first().click();

        // Verify the offcanvas with candidate details appears
        cy.get('.offcanvas.show').should('be.visible');
        cy.get('.offcanvas-title').should('contain', 'Detalles del Candidato');

        // Check that candidate information is displayed
        cy.get('.offcanvas-body h5').should('be.visible');
    });

    it('should be able to drag candidate card between swim lanes and persist changes', () => {
        // Visit specific position detail page
        cy.visit('/positions/1');

        // 1. Find Jane Smith's card and get its draggableId and index
        cy.contains('.card-title', 'Jane Smith')
            .closest('[data-rbd-draggable-id]')
            .then($janeCard => {
                // Get Jane's draggableId
                const draggableId = $janeCard.attr('data-rbd-draggable-id');

                // 2. Find the source column (Technical Interview)
                cy.contains('.card-header', 'Technical Interview')
                    .closest('[data-rbd-droppable-id]')
                    .then($sourceColumn => {
                        const sourceDroppableId = $sourceColumn.attr('data-rbd-droppable-id');

                        // Find Jane's index in source column
                        cy.get(`[data-rbd-droppable-id="${sourceDroppableId}"]`)
                            .find('[data-rbd-draggable-id]')
                            .then($cards => {
                                const sourceIndex = $cards.index($janeCard);

                                // 3. Find the destination column (Manager Interview)
                                cy.contains('.card-header', 'Manager Interview')
                                    .closest('[data-rbd-droppable-id]')
                                    .then($destColumn => {
                                        const destDroppableId = $destColumn.attr('data-rbd-droppable-id');

                                        // 4. Get a reference to the DragDropContext's onDragEnd function
                                        cy.window().then(win => {
                                            // Construct the drag result object that the onDragEnd handler expects
                                            const dragResult = {
                                                draggableId: draggableId,
                                                type: 'DEFAULT',
                                                source: {
                                                    droppableId: sourceDroppableId,
                                                    index: sourceIndex
                                                },
                                                destination: {
                                                    droppableId: destDroppableId,
                                                    index: 0 // Put at the top of the destination column
                                                },
                                                reason: 'DROP'
                                            };

                                            // Find the DragDropContext component's onDragEnd prop
                                            // We need to access the React instance to get the callback
                                            cy.document().then(document => {
                                                // Add an object to the window with the drag result
                                                cy.window().then(win => {
                                                    // Use bracket notation to bypass TypeScript errors
                                                    win['triggerOnDragEnd'] = dragResult;

                                                    // Execute a script in the app context to find and call onDragEnd
                                                    win.eval(`
                                // Find React fiber tree and navigate to DragDropContext
                                const rootNode = document.querySelector('.mt-5');
                                if (rootNode) {
                                  // Look for React fiber root node
                                  const reactRootKey = Object.keys(rootNode).find(key => 
                                    key.startsWith('__reactFiber$') || 
                                    key.startsWith('__reactInternals$')
                                  );
                                  
                                  if (reactRootKey) {
                                    let fiber = rootNode[reactRootKey];
                                    let dragDropContext;
                                    
                                    // Traverse the fiber tree to find DragDropContext
                                    function findDragDropContext(fiber) {
                                      if (!fiber) return null;
                                      
                                      // Check if this is a DragDropContext component
                                      if (fiber.type && 
                                          ((fiber.type.displayName === 'DragDropContext') || 
                                           (fiber.type.name === 'DragDropContext'))) {
                                        return fiber;
                                      }
                                      
                                      // Check children
                                      if (fiber.child) {
                                        const childResult = findDragDropContext(fiber.child);
                                        if (childResult) return childResult;
                                      }
                                      
                                      // Check siblings
                                      if (fiber.sibling) {
                                        const siblingResult = findDragDropContext(fiber.sibling);
                                        if (siblingResult) return siblingResult;
                                      }
                                      
                                      return null;
                                    }
                                    
                                    dragDropContext = findDragDropContext(fiber);
                                    
                                    if (dragDropContext && dragDropContext.memoizedProps && dragDropContext.memoizedProps.onDragEnd) {
                                      // Call the onDragEnd function with our drag result
                                      dragDropContext.memoizedProps.onDragEnd(window.triggerOnDragEnd);
                                    }
                                  }
                                }
                              `);

                                                    // Wait for UI to update
                                                    cy.wait(500);

                                                    // Reload the page to verify changes were persisted
                                                    cy.reload();

                                                    // Verify Jane Smith is now in the Manager Interview column
                                                    cy.contains('.card-header', 'Manager Interview')
                                                        .parent()
                                                        .within(() => {
                                                            cy.contains('Jane Smith').should('exist');
                                                        });

                                                    // Verify Jane Smith is no longer in the Technical Interview column  
                                                    cy.contains('.card-header', 'Technical Interview')
                                                        .parent()
                                                        .within(() => {
                                                            cy.contains('Jane Smith').should('not.exist');
                                                        });
                                                });
                                            });
                                        });
                                    });
                            });
                    });
            });
    });
});
