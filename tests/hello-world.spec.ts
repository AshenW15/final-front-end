import { test, expect } from '@playwright/test';

test('hello world', async ({ page }) => {
    await page.goto('http://localhost:3000'); // Adjust the URL as needed
    const helloWorldText = await page.textContent('h1'); // Adjust the selector as needed
    expect(helloWorldText).toBe('Hello World'); // Adjust the expected text as needed
});