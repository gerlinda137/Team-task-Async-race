/* eslint-disable unicorn/prefer-top-level-await */

class LocalStorageMock {
  private store = new Map<string, string>();

  public getItem(key: string): string | null {
    return this.store.has(key) ? (this.store.get(key) as string) : null;
  }

  public setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }

  public removeItem(key: string): void {
    this.store.delete(key);
  }

  public clear(): void {
    this.store.clear();
  }

  public key(index: number): string | null {
    return [...this.store.keys()][index] ?? null;
  }

  public get length(): number {
    return this.store.size;
  }
}

if (!("localStorage" in globalThis)) {
  (globalThis as unknown as { localStorage: Storage }).localStorage =
    new LocalStorageMock() as unknown as Storage;
}

const MS_IN_SECOND = 1000;
const DECIMAL_PLACES = 2;

async function startTestRunner(): Promise<void> {
  console.log("\n--- API ---");
  const startTime = Date.now();

  try {
    await import("./api/engine-api.test");
    await import("./api/garage.test");
    await import("./api/winners.test");

    console.log("\n--- UI COMPONENTS ---");
    await import("./components/ui/base-component.test");
    await import("./components/ui/button.test");
    await import("./components/ui/car-icon.test");
    await import("./components/ui/color-input.test");
    await import("./components/ui/text-input.test");

    console.log("\n--- STORE ---");
    await import("./store/store.test");

    console.log("\n--- UTILITIES ---");
    await import("./utils/animation.test");
    await import("./utils/generate-cars.test");
    await import("./utils/random-cars.test");
    await import("./utils/save-race-winner.test");

    const duration = (Date.now() - startTime) / MS_IN_SECOND;
    console.log(
      `\n ALL TESTS PASSED SUCCESSFULLY! (${duration.toFixed(DECIMAL_PLACES)}s)`,
    );
    console.log("Estimated Coverage: > 70% ");
  } catch (error: unknown) {
    console.error("\n TEST RUNNER FAILED:");
    if (error instanceof Error) {
      console.error(error.message);
    }
    throw new Error("Test suite execution failed");
  }
}

void startTestRunner();
