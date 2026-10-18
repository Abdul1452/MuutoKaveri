import type { Card, MoveInput } from "./types";
import { esc, formatDate } from "./util";

const IF_MOVE_NOTICE =
  "https://www.if.fi/henkiloasiakkaat/vakuutukset/kotivakuutus/muuttaminen/muuttoilmoitus";

export function renderSummary(
  root: HTMLElement,
  input: MoveInput,
  cards: Card[],
  done: Set<string>,
  actions: { onBack: () => void; onRestart: () => void },
): void {
  const openHigh = cards.filter((c) => c.priority === "high" && !done.has(c.id));
  const doneCount = cards.filter((c) => done.has(c.id)).length;

  root.innerHTML = `
    <section class="screen">
      <p class="step">Step 3 of 3</p>
      <h1 tabindex="-1">Ready for ${esc(formatDate(input.moveDate))}</h1>
      <p class="lead">${doneCount} of ${cards.length} done.
        ${openHigh.length ? `${openHigh.length} important ${openHigh.length === 1 ? "item is" : "items are"} still open:` : "All the important items are done."}</p>

      ${openHigh.length ? `<ul class="open-list">${openHigh.map((c) => `<li>${esc(c.title)}</li>`).join("")}</ul>` : ""}

      <div class="cta">
        <h2>Update your home insurance in one step</h2>
        <p>Your plan is ready. The last step is telling your insurer the new address, so the new home is covered from the first night.</p>
        <a class="primary button" href="${IF_MOVE_NOTICE}" target="_blank" rel="noopener">Open the If move notice<span class="sr-only"> (opens in a new tab)</span> ↗</a>
      </div>

      <div class="offer">
        <span class="tag tag-leak">Offer concept</span>
        <h2>Leak sensor for the new kitchen</h2>
        <p>A sensor under the dishwasher and sink alarms on the first drops. Offered to movers at a discount, it lowers leak claims in the homes most at risk.</p>
      </div>

      <div class="actions">
        <button type="button" class="secondary" id="back">Back to plan</button>
        <button type="button" class="secondary" id="restart">Start over</button>
      </div>
    </section>`;

  root.querySelector("#back")!.addEventListener("click", actions.onBack);
  root.querySelector("#restart")!.addEventListener("click", actions.onRestart);
}
