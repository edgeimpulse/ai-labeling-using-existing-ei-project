# AI Actions block: Label data using an existing Edge Impulse project

This is an Edge Impulse [AI Actions block](https://docs.edgeimpulse.com/docs/edge-impulse-studio/organizations/custom-blocks/transformation-blocks) that lets you label new image data using the model in an existing Edge Impulse project. You can use this repository as a basis to implement other auto-labeling techniques.

## Use this from Edge Impulse (professional / enterprise)

If you just want to use this AI Actions block in your Edge Impulse project you don't need this repo. Just go to any project, select **Data acquisition > AI Actions**, choose **Label using existing project (images only)** (available for professional and enterprise projects only).

## Developing your own block

You can use this repository to develop your own block that uses Edge Impulse projects (or some other auto-labeler) to help you label data, or add metadata.

### Running this block locally

1. Create a new Edge Impulse project, and add some images.
2. Create a file called `ids.json` and add the IDs of the samples you want to label. You can find the sample ID by clicking the 'expand' button on **Data acquisiton**.

    ![Finding IDs](images/find_ids.png)

    Add these IDs to the `ids.json` file as an array of numbers, e.g.:

    ```json
    [1299267659, 1299267609, 1299267606]
    ```

3. Load your API key. Here, use the API Key of your _target_ project (the one where you want to label data):

    ```
    export EI_PROJECT_API_KEY=ei_44...
    ```

    > You can find your Edge Impulse API Key via **Dashboard > Keys**.

4. Install Node.js 20.
5. Build and run this project to label your data:

    ```
    npm run build
    node build/label-using-existing-project.js \
        --source-project-api-key "ei_1fe..." \
        --data-ids-file ids.json
    ```

    > Note 1: Here fill in the API key of the _source_ project (the one which model you want to use to label).

    > Note 2: If you have multiple impulses in the source project, you can specify the impulse via `--source-project-impulse-id <impulse-id>`.

6. Afterwards you'll have labeled data in your project.

### Pushing block to Edge Impulse (enterprise only)

If you've modified this block, you can push it back to Edge Impulse so it's available to everyone in your organization.

1. Update `parameters.json` to update the name and description of your block.
2. Initialize and push the block:

    ```
    $ edge-impulse-blocks init
    $ edge-impulse-blocks push
    ```

3. Afterwards, you can run your block through **Data acquisition > AI Actions** in any Edge Impulse project.

### Proposed changes

AI Actions blocks should be able to run in 'preview' mode (triggered when you click *Label preview data* in the Studio) - where changes are _staged_ but not directly applied. If this is the case `--propose-actions <job-id>` is passed into your block. When you see this flag you should not apply changes directly (e.g. via `api.rawData.editLabel`) but rather use the `setSampleProposedChanges` API. Search for this API in [label-using-existing-project.ts](label-using-existing-project.ts) to see how this should be used.
