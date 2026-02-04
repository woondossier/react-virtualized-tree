import { test, expect } from '@playwright/test';

test.describe('Tree Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/examples/e2e-test');
    // Wait for the tree to be fully rendered
    await page.waitForSelector('[data-testid="node-1"]');
  });

  test.describe('Initial Render', () => {
    test('should render all visible nodes', async ({ page }) => {
      // Parent 1 is expanded, so its children should be visible
      await expect(page.getByTestId('node-1')).toBeVisible();
      await expect(page.getByTestId('node-11')).toBeVisible();
      await expect(page.getByTestId('node-12')).toBeVisible();

      // Parent 2 is collapsed, so its children should not be visible
      await expect(page.getByTestId('node-2')).toBeVisible();
      await expect(page.getByTestId('node-21')).not.toBeVisible();

      // Leaf node should be visible
      await expect(page.getByTestId('node-3')).toBeVisible();
    });

    test('should display correct node names', async ({ page }) => {
      await expect(page.getByTestId('node-name-1')).toHaveText('Parent 1');
      await expect(page.getByTestId('node-name-11')).toHaveText('Child 1.1');
      await expect(page.getByTestId('node-name-12')).toHaveText('Child 1.2');
    });
  });

  test.describe('Child Node Updates (Regression: forceUpdateGrid fix)', () => {
    test('should immediately show renamed child node without selecting another element', async ({
      page,
    }) => {
      // Verify initial name
      await expect(page.getByTestId('node-name-11')).toHaveText('Child 1.1');

      // Click the rename button (simulates external state update)
      await page.getByTestId('rename-child-button').click();

      // The node name should update IMMEDIATELY without any other interaction
      await expect(page.getByTestId('node-name-11')).toHaveText('Renamed Child 1.1');

      // Verify the action was recorded
      await expect(page.getByTestId('last-action')).toContainText('renamed');
    });

    test('should immediately show toggled favorite state without selecting another element', async ({
      page,
    }) => {
      // Verify initial state - Child 1.1 is not a favorite
      const node11 = page.getByTestId('node-11');
      await expect(node11).toHaveAttribute('data-node-favorite', 'false');

      // Click the toggle favorite button
      await page.getByTestId('toggle-favorite-button').click();

      // The favorite state should update IMMEDIATELY
      await expect(node11).toHaveAttribute('data-node-favorite', 'true');

      // Verify the action was recorded
      await expect(page.getByTestId('last-action')).toContainText('toggled-favorite');
    });

    test('should immediately show new child node when added', async ({ page }) => {
      // Verify the new child doesn't exist yet
      await expect(page.getByTestId('node-13')).not.toBeVisible();

      // Click the add child button
      await page.getByTestId('add-child-button').click();

      // The new child should appear IMMEDIATELY
      await expect(page.getByTestId('node-13')).toBeVisible();
      await expect(page.getByTestId('node-name-13')).toHaveText('New Child 1.3');

      // Verify the action was recorded
      await expect(page.getByTestId('last-action')).toContainText('added-child');
    });
  });

  test.describe('Expand/Collapse', () => {
    test('should expand collapsed node when clicking expand icon', async ({ page }) => {
      // Parent 2 is collapsed - child should not be visible
      await expect(page.getByTestId('node-21')).not.toBeVisible();

      // Click the expand icon on Parent 2
      const expandIcon = page.getByTestId('node-2').locator('.mi-keyboard-arrow-right');
      await expandIcon.click();

      // Child should now be visible
      await expect(page.getByTestId('node-21')).toBeVisible();
    });

    test('should collapse expanded node when clicking collapse icon', async ({ page }) => {
      // Parent 1 is expanded - children should be visible
      await expect(page.getByTestId('node-11')).toBeVisible();
      await expect(page.getByTestId('node-12')).toBeVisible();

      // Click the collapse icon on Parent 1
      const collapseIcon = page.getByTestId('node-1').locator('.mi-keyboard-arrow-down');
      await collapseIcon.click();

      // Children should now be hidden
      await expect(page.getByTestId('node-11')).not.toBeVisible();
      await expect(page.getByTestId('node-12')).not.toBeVisible();
    });
  });

  test.describe('Favorite Toggle', () => {
    test('should toggle favorite state when clicking favorite icon', async ({ page }) => {
      // Child 1.2 starts as favorite
      const node12 = page.getByTestId('node-12');
      await expect(node12).toHaveAttribute('data-node-favorite', 'true');

      // Click the favorite icon to unfavorite
      const favoriteIcon = node12.locator('.mi-star');
      await favoriteIcon.click();

      // Should now be unfavorited
      await expect(node12).toHaveAttribute('data-node-favorite', 'false');
    });
  });

  test.describe('Delete Node', () => {
    test('should remove node when clicking delete icon', async ({ page }) => {
      // Leaf Node (id: 3) is deletable and visible
      await expect(page.getByTestId('node-3')).toBeVisible();

      // Click the delete icon
      const deleteIcon = page.getByTestId('node-3').locator('.mi-delete');
      await deleteIcon.click();

      // Node should be removed
      await expect(page.getByTestId('node-3')).not.toBeVisible();
    });
  });

  test.describe('Multiple Sequential Updates', () => {
    test('should handle multiple state changes in sequence', async ({ page }) => {
      // Rename
      await page.getByTestId('rename-child-button').click();
      await expect(page.getByTestId('node-name-11')).toHaveText('Renamed Child 1.1');

      // Toggle favorite
      await page.getByTestId('toggle-favorite-button').click();
      await expect(page.getByTestId('node-11')).toHaveAttribute('data-node-favorite', 'true');

      // Add child
      await page.getByTestId('add-child-button').click();
      await expect(page.getByTestId('node-13')).toBeVisible();

      // All previous changes should still be visible
      await expect(page.getByTestId('node-name-11')).toHaveText('Renamed Child 1.1');
      await expect(page.getByTestId('node-11')).toHaveAttribute('data-node-favorite', 'true');
    });
  });
});
