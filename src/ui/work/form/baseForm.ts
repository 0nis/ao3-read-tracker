export function createFormContainer(id: string, title: string): HTMLDivElement {
  const wrapper = document.createElement("div");
  wrapper.className = "wrapper toggled";
  wrapper.id = id;
  wrapper.style.display = "block";

  const post = document.createElement("div");
  post.className = "post";
  post.innerHTML = `<h3 class="landmark heading">${title}</h3>`;
  wrapper.appendChild(post);

  return wrapper;
}

export function appendFormToFeedback(form: HTMLElement): void {
  const feedback = document.getElementById("feedback");
  if (!feedback) {
    console.error("[AO3 Mark as Read] Could not find #feedback container");
    return;
  }
  feedback.appendChild(form);
  form.scrollIntoView({ behavior: "instant", block: "start" });
}
