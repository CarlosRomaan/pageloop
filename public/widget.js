(function () {
  const currentScript = document.currentScript;
  const widgetPublicKey = currentScript?.getAttribute("data-project");

  if (!widgetPublicKey) {
    console.warn("[PageLoop] Missing data-project attribute.");
    return;
  }

  const apiBaseUrl = window.location.origin;
  const pageUrl = window.location.href;
  const pageTitle = document.title;

  const state = {
    comments: [],
    isOpen: false,
    isCommentMode: false,
    selectedComment: null,
    showResolved: false,
    isCommentsListOpen: false,
  };

  const styles = document.createElement("style");

  styles.innerHTML = `
    .pl-feedback-button {
      position: fixed;
      right: 24px;
      bottom: 24px;
      z-index: 999999;
      border: 1px solid #e5e7eb;
      background: #ffffff;
      color: #111827;
      border-radius: 999px;
      padding: 10px 16px;
      font: 500 14px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);
      cursor: pointer;
    }

    .pl-panel {
      position: fixed;
      right: 24px;
      bottom: 80px;
      z-index: 999999;
      width: 280px;
      border: 1px solid #e5e7eb;
      background: #ffffff;
      border-radius: 16px;
      padding: 16px;
      box-shadow: 0 16px 40px rgba(15, 23, 42, 0.16);
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    .pl-panel-title {
      font-size: 14px;
      font-weight: 600;
      color: #111827;
      margin-bottom: 12px;
    }

    .pl-panel-button {
      width: 100%;
      border: 1px solid #e5e7eb;
      background: #ffffff;
      border-radius: 10px;
      padding: 10px 12px;
      margin-top: 8px;
      text-align: left;
      cursor: pointer;
      font-size: 14px;
      color: #111827;
    }

    .pl-panel-button:hover {
      background: #f9fafb;
    }

    .pl-marker {
      position: absolute;
      z-index: 999998;
      border: 1px solid #e5e7eb;
      background: #ffffff;
      color: #111827;
      border-radius: 999px;
      padding: 6px 10px;
      font: 600 12px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.14);
      cursor: pointer;
    }

    .pl-composer {
      position: absolute;
      z-index: 999999;
      width: 320px;
      border: 1px solid #e5e7eb;
      background: #ffffff;
      border-radius: 16px;
      padding: 16px;
      box-shadow: 0 16px 40px rgba(15, 23, 42, 0.16);
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    .pl-composer textarea {
      width: 100%;
      min-height: 96px;
      resize: vertical;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      padding: 10px;
      font-size: 14px;
      box-sizing: border-box;
    }

    .pl-composer-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 12px;
    }

    .pl-secondary-button,
    .pl-primary-button {
      border-radius: 10px;
      padding: 8px 12px;
      font-size: 14px;
      cursor: pointer;
    }

    .pl-secondary-button {
      border: 1px solid #e5e7eb;
      background: #ffffff;
      color: #111827;
    }

    .pl-primary-button {
      border: 1px solid #2563eb;
      background: #2563eb;
      color: #ffffff;
    }

    body.pl-comment-mode {
      cursor: crosshair;
    }

    .pl-comment-sidebar {
      position: fixed;
      top: 24px;
      right: 24px;
      bottom: 24px;
      z-index: 1000000;
      width: 380px;
      border: 1px solid #e5e7eb;
      background: #ffffff;
      border-radius: 20px;
      box-shadow: 0 24px 60px rgba(15, 23, 42, 0.18);
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .pl-comment-sidebar-header {
      padding: 18px 18px 14px;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
    }

    .pl-comment-sidebar-title {
      font-size: 15px;
      font-weight: 700;
      color: #111827;
    }

    .pl-comment-sidebar-subtitle {
      margin-top: 4px;
      font-size: 12px;
      color: #6b7280;
    }

    .pl-comment-sidebar-close {
      border: 1px solid #e5e7eb;
      background: #ffffff;
      color: #6b7280;
      border-radius: 10px;
      width: 32px;
      height: 32px;
      cursor: pointer;
    }

    .pl-comment-sidebar-body {
      padding: 18px;
      overflow-y: auto;
      flex: 1;
    }

    .pl-status-badge {
      display: inline-flex;
      align-items: center;
      border-radius: 999px;
      padding: 4px 8px;
      font-size: 11px;
      font-weight: 700;
      margin-bottom: 12px;
    }

    .pl-status-open {
      background: #fef3c7;
      color: #92400e;
    }

    .pl-status-in-progress {
      background: #dbeafe;
      color: #1e40af;
    }

    .pl-status-in-review {
      background: #ede9fe;
      color: #6d28d9;
    }

    .pl-status-resolved {
      background: #dcfce7;
      color: #166534;
    }

    .pl-comment-message {
      font-size: 15px;
      line-height: 1.5;
      color: #111827;
      margin: 0;
    }

    .pl-comment-meta {
      margin-top: 10px;
      font-size: 12px;
      color: #6b7280;
    }

    .pl-replies-section {
      margin-top: 22px;
      border-top: 1px solid #e5e7eb;
      padding-top: 18px;
    }

    .pl-replies-title {
      font-size: 13px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 12px;
    }

    .pl-reply-item {
      border: 1px solid #e5e7eb;
      border-radius: 14px;
      padding: 12px;
      margin-bottom: 10px;
      background: #fafafa;
    }

    .pl-reply-message {
      font-size: 13px;
      line-height: 1.5;
      color: #111827;
      margin: 0;
    }

    .pl-reply-meta {
      margin-top: 8px;
      font-size: 11px;
      color: #6b7280;
    }

    .pl-reply-form {
      margin-top: 16px;
      border-top: 1px solid #e5e7eb;
      padding-top: 16px;
    }

    .pl-reply-form textarea {
      width: 100%;
      min-height: 88px;
      resize: vertical;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 10px;
      font-size: 13px;
      box-sizing: border-box;
    }

    .pl-reply-form button {
      margin-top: 10px;
      width: 100%;
      border: 1px solid #2563eb;
      background: #2563eb;
      color: #ffffff;
      border-radius: 10px;
      padding: 10px 12px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }

    .pl-status-control {
      margin-bottom: 14px;
    }

    .pl-status-control label {
      display: block;
      font-size: 12px;
      font-weight: 700;
      color: #374151;
      margin-bottom: 6px;
    }

    .pl-status-control select {
      width: 100%;
      height: 38px;
      border: 1px solid #e5e7eb;
      background: #ffffff;
      color: #111827;
      border-radius: 10px;
      padding: 0 10px;
      font-size: 13px;
    }

    .pl-marker-open {
      background: #fffbeb;
      border-color: #f59e0b;
      color: #92400e;
    }

    .pl-marker-in-progress {
      background: #eff6ff;
      border-color: #3b82f6;
      color: #1e40af;
    }

    .pl-marker-in-review {
      background: #f5f3ff;
      border-color: #8b5cf6;
      color: #6d28d9;
    }

    .pl-marker-resolved {
      background: #f0fdf4;
      border-color: #22c55e;
      color: #166534;
    }

    .pl-comments-list {
      margin-top: 12px;
      border-top: 1px solid #e5e7eb;
      padding-top: 12px;
    }

    .pl-comments-list-item {
      width: 100%;
      border: 1px solid #e5e7eb;
      background: #ffffff;
      border-radius: 10px;
      padding: 10px;
      text-align: left;
      cursor: pointer;
      margin-bottom: 8px;
    }

    .pl-comments-list-item:hover {
      background: #f9fafb;
    }

    .pl-comments-list-number {
      font-size: 11px;
      font-weight: 700;
      color: #6b7280;
    }

    .pl-comments-list-message {
      margin-top: 4px;
      font-size: 13px;
      color: #111827;
      line-height: 1.4;
    }

    .pl-marker-selected {
      outline: 3px solid rgba(37, 99, 235, 0.25);
      transform: scale(1.08);
    }
  `;

  document.head.appendChild(styles);

  const sendHeartbeat = async () => {
    await fetch(`${apiBaseUrl}/api/widget/heartbeat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        widgetPublicKey,
        url: pageUrl,
        title: pageTitle,
      }),
    });
  };

  const loadComments = async () => {
    const response = await fetch(
      `${apiBaseUrl}/api/widget/comments?widgetPublicKey=${encodeURIComponent(
        widgetPublicKey
      )}&pageUrl=${encodeURIComponent(pageUrl)}`
    );

    const data = await response.json();

    state.comments = data.comments ?? [];

    renderMarkers();
  };

  const createComment = async ({ message, x, y, target }) => {
    const response = await fetch(`${apiBaseUrl}/api/widget/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        widgetPublicKey,
        pageUrl,
        pageTitle,
        message,
        position: {
          x,
          y,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          scrollX: window.scrollX,
          scrollY: window.scrollY,
          cssSelector: getSimpleSelector(target),
          elementText: target?.innerText?.slice(0, 120),
          elementTag: target?.tagName?.toLowerCase(),
        },
      }),
    });

    const data = await response.json();

    if (data.comment) {
      state.comments.push(data.comment);
      renderMarkers();
    }
  };

  const getSimpleSelector = (element) => {
    if (!element || !element.tagName) {
      return null;
    }

    if (element.id) {
      return `#${element.id}`;
    }

    const tag = element.tagName.toLowerCase();

    if (element.className && typeof element.className === "string") {
      const firstClass = element.className.split(" ").filter(Boolean)[0];

      if (firstClass) {
        return `${tag}.${firstClass}`;
      }
    }

    return tag;
  };

  const formatStatus = (status) => {
    return status
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getStatusClassName = (status) => {
    const classes = {
      OPEN: "pl-status-open",
      IN_PROGRESS: "pl-status-in-progress",
      IN_REVIEW: "pl-status-in-review",
      RESOLVED: "pl-status-resolved",
    };

    return classes[status] || "pl-status-open";
  };

  const updateCommentStatus = async ({ commentId, status }) => {
    const response = await fetch(`${apiBaseUrl}/api/widget/comments/${commentId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        widgetPublicKey,
        status,
      }),
    });

    const data = await response.json();

    return data.comment;
  };

  const renderCommentSidebar = (comment) => {
    document.querySelectorAll(".pl-comment-sidebar").forEach((sidebar) => {
      sidebar.remove();
    });

    if (!comment) {
      return;
    }

    const sidebar = document.createElement("aside");
    sidebar.className = "pl-comment-sidebar";

    const repliesHtml = comment.replies?.length
      ? comment.replies
        .map(
          (reply) => `
            <div class="pl-reply-item">
              <p class="pl-reply-message">${reply.message}</p>
              <div class="pl-reply-meta">
                ${reply.author?.name || reply.author?.email || "Unknown"}
              </div>
            </div>
          `
        )
        .join("")
      : `<p class="pl-comment-meta">No replies yet.</p>`;

    sidebar.innerHTML = `
    <div class="pl-comment-sidebar-header">
      <div>
        <div class="pl-comment-sidebar-title">
          Comment #${comment.number}
        </div>
        <div class="pl-comment-sidebar-subtitle">
          ${comment.author?.name || comment.author?.email || "Unknown"}
        </div>
      </div>

      <button class="pl-comment-sidebar-close" type="button">×</button>
    </div>

    <div class="pl-comment-sidebar-body">
      <div class="pl-status-control">
        <label>Status</label>
        <select>
          <option value="OPEN" ${comment.status === "OPEN" ? "selected" : ""}>Open</option>
          <option value="IN_PROGRESS" ${comment.status === "IN_PROGRESS" ? "selected" : ""}>In Progress</option>
          <option value="IN_REVIEW" ${comment.status === "IN_REVIEW" ? "selected" : ""}>In Review</option>
          <option value="RESOLVED" ${comment.status === "RESOLVED" ? "selected" : ""}>Resolved</option>
        </select>
      </div>

      <p class="pl-comment-message">
        ${comment.message}
      </p>

      <div class="pl-comment-meta">
        Assigned to ${comment.assignee?.name || "Unassigned"}
      </div>

      <div class="pl-replies-section">
        <div class="pl-replies-title">Replies</div>
        ${repliesHtml}

        <div class="pl-reply-form">
          <textarea placeholder="Write a reply..."></textarea>
          <button type="button">Send reply</button>
        </div>
      </div>
    </div>
  `;

    sidebar
      .querySelector(".pl-comment-sidebar-close")
      .addEventListener("click", () => {
        state.selectedComment = null;
        sidebar.remove();
        renderMarkers();
      });

    const statusSelect = sidebar.querySelector(".pl-status-control select");

    statusSelect.addEventListener("change", async (event) => {
      const nextStatus = event.target.value;

      statusSelect.disabled = true;

      try {
        const updatedComment = await updateCommentStatus({
          commentId: comment.id,
          status: nextStatus,
        });

        const commentIndex = state.comments.findIndex(
          (stateComment) => stateComment.id === updatedComment.id
        );

        if (commentIndex >= 0) {
          state.comments[commentIndex] = updatedComment;
        }

        state.selectedComment = updatedComment;

        renderMarkers();
        renderCommentSidebar(updatedComment);
      } catch (error) {
        console.error("[PageLoop Status]", error);
        statusSelect.disabled = false;
      }
    });

    const replyTextarea = sidebar.querySelector(".pl-reply-form textarea");
    const replyButton = sidebar.querySelector(".pl-reply-form button");

    replyButton.addEventListener("click", async () => {
      const message = replyTextarea.value.trim();

      if (!message) {
        return;
      }

      replyButton.disabled = true;
      replyButton.textContent = "Sending...";

      try {
        const reply = await createReply({
          commentId: comment.id,
          message,
        });

        comment.replies = [...(comment.replies || []), reply];
        state.selectedComment = comment;

        renderCommentSidebar(comment);
      } catch (error) {
        console.error("[PageLoop Reply]", error);

        replyButton.disabled = false;
        replyButton.textContent = "Send reply";
      }
    });

    document.body.appendChild(sidebar);
  };

  const createReply = async ({ commentId, message }) => {
    const response = await fetch(`${apiBaseUrl}/api/widget/replies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        widgetPublicKey,
        commentId,
        message,
      }),
    });

    const data = await response.json();

    return data.reply;
  };

  const getMarkerStatusClassName = (status) => {
    const classes = {
      OPEN: "pl-marker-open",
      IN_PROGRESS: "pl-marker-in-progress",
      IN_REVIEW: "pl-marker-in-review",
      RESOLVED: "pl-marker-resolved",
    };

    return classes[status] || "pl-marker-open";
  };

  const renderMarkers = () => {
    document.querySelectorAll(".pl-marker").forEach((marker) => {
      marker.remove();
    });

    state.comments.forEach((comment) => {
      if (comment.status === "RESOLVED" && !state.showResolved) {
        return;
      }

      if (!comment.position) {
        return;
      }

      const marker = document.createElement("button");
      marker.className = `pl-marker ${getMarkerStatusClassName(comment.status)} ${state.selectedComment?.id === comment.id ? "pl-marker-selected" : ""
        }`;

      marker.innerText =
        comment.status === "RESOLVED"
          ? `✓ ${comment.number}`
          : `💬 ${comment.number}`;

      marker.style.left = `${comment.position.x}px`;
      marker.style.top = `${comment.position.y}px`;

      marker.addEventListener("click", (event) => {
        event.stopPropagation();

        state.selectedComment = comment;

        renderMarkers();
        renderCommentSidebar(comment);
      });

      document.body.appendChild(marker);
    });
  };

  const openComposer = ({ x, y, target }) => {
    document.querySelectorAll(".pl-composer").forEach((composer) => {
      composer.remove();
    });

    const composer = document.createElement("div");
    composer.className = "pl-composer";
    composer.style.left = `${x}px`;
    composer.style.top = `${y}px`;

    composer.innerHTML = `
      <div class="pl-panel-title">New Comment</div>
      <textarea placeholder="Write feedback..."></textarea>
      <div class="pl-composer-actions">
        <button class="pl-secondary-button" type="button">Cancel</button>
        <button class="pl-primary-button" type="button">Save comment</button>
      </div>
    `;

    const textarea = composer.querySelector("textarea");
    const cancelButton = composer.querySelector(".pl-secondary-button");
    const saveButton = composer.querySelector(".pl-primary-button");

    cancelButton.addEventListener("click", () => {
      composer.remove();
      disableCommentMode();
    });

    saveButton.addEventListener("click", async () => {
      const message = textarea.value.trim();

      if (!message) {
        return;
      }

      await createComment({
        message,
        x,
        y,
        target,
      });

      composer.remove();
      disableCommentMode();
    });

    document.body.appendChild(composer);
    textarea.focus();
  };

  const enableCommentMode = () => {
    state.isCommentMode = true;
    document.body.classList.add("pl-comment-mode");
  };

  const disableCommentMode = () => {
    state.isCommentMode = false;
    document.body.classList.remove("pl-comment-mode");
  };

  const renderPanel = () => {
    document.querySelectorAll(".pl-panel").forEach((panel) => {
      panel.remove();
    });

    if (!state.isOpen) {
      return;
    }

    const panel = document.createElement("div");
    panel.className = "pl-panel";

    panel.innerHTML = `
      <div class="pl-panel-title">Feedback Mode</div>
      <button class="pl-panel-button" type="button" data-action="add-comment">+ Add Comment</button>
      <button class="pl-panel-button" type="button" data-action="view-comments">
        ${state.isCommentsListOpen ? "Hide comments" : `Comments (${state.comments.length})`}
      </button>

      ${state.isCommentsListOpen
        ? `
          <div class="pl-comments-list">
            ${state.comments
          .filter(
            (comment) =>
              state.showResolved || comment.status !== "RESOLVED"
          )
          .map(
            (comment) => `
                  <button
                    class="pl-comments-list-item"
                    data-comment-id="${comment.id}"
                  >
                    <div class="pl-comments-list-number">
                      #${comment.number}
                    </div>

                    <div class="pl-comments-list-message">
                      ${comment.message.slice(0, 80)}
                    </div>
                  </button>
                `
          )
          .join("")}
          </div>
        `
        : ""
      }
      <button class="pl-panel-button" type="button" data-action="toggle-resolved">
        ${state.showResolved ? "Hide resolved" : "Show resolved"}
      </button>
      <button class="pl-panel-button" type="button" data-action="close">Done Reviewing</button>
    `;

    panel.querySelector('[data-action="add-comment"]').addEventListener("click", () => {
      enableCommentMode();
    });

    panel
      .querySelector('[data-action="view-comments"]')
      .addEventListener("click", () => {
        state.isCommentsListOpen = !state.isCommentsListOpen;
        renderPanel();
      });

    panel
      .querySelector('[data-action="toggle-resolved"]')
      .addEventListener("click", () => {
        state.showResolved = !state.showResolved;
        renderMarkers();
        renderPanel();
      });

    panel.querySelector('[data-action="close"]').addEventListener("click", () => {
      state.isOpen = false;
      disableCommentMode();
      renderPanel();
    });

    panel
      .querySelectorAll(".pl-comments-list-item")
      .forEach((button) => {
        button.addEventListener("click", () => {
          const commentId = button.dataset.commentId;

          const comment = state.comments.find(
            (item) => item.id === commentId
          );

          if (!comment) {
            return;
          }

          state.selectedComment = comment;

          renderMarkers();
          renderCommentSidebar(comment);
        });
      });

    document.body.appendChild(panel);
  };

  const renderButton = () => {
    const button = document.createElement("button");
    button.className = "pl-feedback-button";
    button.innerText = "💬 Feedback";

    button.addEventListener("click", () => {
      state.isOpen = !state.isOpen;
      renderPanel();
    });

    document.body.appendChild(button);
  };

  document.addEventListener("click", (event) => {
    if (!state.isCommentMode) {
      return;
    }

    const target = event.target;

    if (
      target.closest(".pl-panel") ||
      target.closest(".pl-feedback-button") ||
      target.closest(".pl-composer") ||
      target.closest(".pl-marker")
    ) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    openComposer({
      x: event.pageX,
      y: event.pageY,
      target,
    });
  }, true);

  const init = async () => {
    renderButton();

    try {
      await sendHeartbeat();
      await loadComments();
    } catch (error) {
      console.error("[PageLoop]", error);
    }
  };

  init();
})();