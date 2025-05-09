# Prompts for Integration Testing

## Prompt 1

You are an expert at integration testing. Study the @frontend   and the @backend   to prepare for testing this project using Cypress.  Does everything look all right?  Do you have any questions or suggestions before we get started?
I have a test plan so you don't need to suggest any tests.

## Prompt 2

Please perform these changes.

## Prompt 3

Can you explain step by step how the backend will know to use the test DB when I start Cypress?

## Prompt 4

OK, try the same thing again, but this time look at the current implementation, because we spent a lot of time to set up a test DB and make sure it is used in the backend. The .env.test file is good, even if you can't see it. So
* look at the commands in @package.json ; they should be fine
* look at the scripts run by those commands
* look at what you have set up for Cypress and see if it will do the job.

## Prompt 5

Now that setup is taken care of, time to create the first test. Here's the spec, in Spanish. Tell me what you think we should do.
Carga de la Página de Position:
Verifica que el título de la posición se muestra correctamente.
Verifica que se muestran las columnas correspondientes a cada fase del proceso de contratación.
Verifica que las tarjetas de los candidatos se muestran en la columna correcta según su fase actual.

## Prompt 6

the test needs to be run in /frontend

## Prompt 7

No. Don't touch the dev server. Update the @backend so that it uses the right port.

## Prompt 8

DB reset and test run is slow. Refactor the test file to put all the assertions in one spec. Also, don't check preconditions — if there is no position, it's an error.

## Prompt 9

@Position Details Page -- should verify position details page functionality -- before each hook (failed).png The test fails. Look at the png — it seems like we're trying to fetch data from the dev server, which I guess is blocked by CORS.
Make only the minimal changes you need to update the URL.

## Prompt 10

pls check that there are no other uses of a hardcoded url

## Prompt 11

the server doesn't start

## Prompt 12

Thanks for explaining! I prefer to run the tests myself.

## Prompt 13

[with specific spec lines selected]

The title should be "Senior Full-Stack Engineer"

## Prompt 14

[with a screenshot from the dev server]

Update the spec to check for the column headers and candidate names found in the image

## Prompt 15

Add another E2E test to check that candidates can be moved from one interview step to another.
Drag "John Doe"'s card from Technical Inverview to Manager Interview.
Check that the card's position is updated on the screen.
Reload the page and check that the card is still in the new position, i.e., that the update was persisted.

## Prompt 16

@Position Details Page -- should move candidate from Technical Interview to Manager Interview (failed).png The dnd fails. Do you know why? Is there a Cypress plugin or similar that could solve this?

## Prompt 17

[reverted]

You're an expert at E2E testing using Cypress. In @position-details.cy.ts  add a test on /positions/1 to check that we are able to drag the "Jane Smith" card from its current swim lane to the one before or after. After dragging, check that that the card is in the intended lane. Then, to check that the new position was persisted, reload the page and make sure that the card is still where it should be.

## Prompt 18

[with terminal output]

error!

## Prompt 19

[with terminal output]

@Position Details Page -- should allow dragging a candidate card to a different swim lane and persist the change (failed).png still doesn't work, but it's a new error

## Prompt 20

[it suggests calling the backend from the test]

I already have tests for the API. What I want now is a real interaction test.

## Prompt 21

I've discovered that the backend test server that gets started when I run `npm run test:setup` in /frontend actually uses the dev DB, not the test one.  Can you figure out what is going on?
When trying to solve this, please look at how we solved other problems in @package.json 
You don't need to look at the `.env` and `.env.test` files; they are known to be good and we use them with great results in the scripts that reset the test database.

## Prompt 22

No, that's not it. The test DB is fine, the problem is that the server connects to the dev DB.

## Prompt 23

Let's improve visibility for the future. In the startup sequence for the backend app, add
```
    const result = await prisma.$queryRaw`SELECT current_database() as db_name`;
    const dbName = (result as any)[0].db_name;
```
and print "Using database: db_name" on the log.

## Prompt 24

I can see the output and it's the wrong DB

## Prompt 25

better output, but it still fails.
Please note that there is no reason to inspect the .env files. They work very well for setting up the databases.

## Prompt 26

[it suggests hardcoding the DB name]

No, that's not acceptable. Only the .env files will have knowledge of the DB names. I'm sure there's a way to pick up the DB URL from the environment before connecting.

## Prompt 27

Great, it works!
Please update most uses of `import ... from '@prisma/client'` to use `import ./lib/prisma` so that we're consistent!

## Prompt 28

[Starting over with the second test]

You're an expert at E2E testing using Cypress. In @position-details.cy.ts  add a test on /positions/1 to check that we are able to drag the "Jane Smith" card from its current swim lane to the one before or after. After dragging, check that that the card is in the intended lane. Then, to check that the new position was persisted, reload the page and make sure that the card is still where it should be.

## Prompt 29

@Position Details Page -- should be able to drag candidate card between swim lanes and persist changes (failed).png pls fix

## Prompt 30

It seems you have trouble deducing the DOM. It looks something like this:
```
<div data-rbd-droppable-id="1" data-rbd-droppable-context-id="0" class="mb-4 card"><div class="text-center card-header">Technical Interview</div><div class="card-body"><div data-rbd-draggable-context-id="0" data-rbd-draggable-id="2" tabindex="0" role="button" aria-describedby="rbd-hidden-text-0-hidden-text-0" data-rbd-drag-handle-draggable-id="2" data-rbd-drag-handle-context-id="0" draggable="false" class="mb-2 card"><div class="card-body"><div class="card-title h5">Jane Smith</div><div><span role="img" aria-label="rating">🟢</span><span role="img" aria-label="rating">🟢</span><span role="img" aria-label="rating">🟢</span><span role="img" aria-label="rating">🟢</span></div></div></div></div></div>
```

## Prompt 31

@Position Details Page -- should be able to drag candidate card between swim lanes and persist changes (failed).png 

## Prompt 32

@Position Details Page -- should be able to drag candidate card between swim lanes and persist changes (failed).png 

## Prompt 33

No, I want an actual interaction test. Is there no plugin or package for cypress and the DND we're using?

## Prompt 34

Does cypress-drag-drop really work with the DND lib we're using? I've heard it has some problems.

## Prompt 35

fix error in terminal output

## Prompt 36

@Position Details Page -- should be able to drag candidate card between swim lanes and persist changes (failed).png Still doesn't work.
I'm beginning to feel that we are wasting our time. Does Beautiful have some kind of API that we can use to simulate or trigger a drag+drop?  

## Prompt 37

Can you show me the place where the frontend calls the backend to update the swim lane?

## Prompt 38

Thanks. Here's the rule: the integration test code is NEVER allowed to directly make any calls to the backend. But sure, if we really can't make Cypress perform a real DnD because Beautiful gets in the way, let's test it this way instead:
1. find the card we want to drop and extract the key features that are needed for Beautiful DND
2. find the swim lane we're dropping onto and extract its features
3. find the onDragEnd callback in the DOM and call it with the two objects that we constructed.
4. reload the page and verify that the card is in the right place
This way we should be able to see that DND works and that everything is wired together properly.
I might have missed some detail somewhere. Do you understand what I mean? Please repeat back this solution in your own words.

## Prompt 39

OK, please go ahead. FYI, I've removed the cypress-real-events library; we can add it back if you need it.

## Prompt 40

Add instructions for running E2E tests
