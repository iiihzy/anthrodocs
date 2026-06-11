import { NextRequest, NextResponse } from "next/server";

interface FeedbackPayload {
  name: string;
  organization: string;
  contact: string;
  username: string;
  body: string;
  expectedResponse: string;
}

const RESPONSE_LABELS: Record<string, string> = {
  "24h": "24小时内",
  "3d": "3个工作日内",
  "1w": "1周内",
  norush: "不急",
};

function buildFeishuCard(data: FeedbackPayload) {
  const responseLabel = RESPONSE_LABELS[data.expectedResponse] || data.expectedResponse;

  return {
    msg_type: "interactive",
    card: {
      header: {
        title: {
          tag: "plain_text",
          content: "📬 收到新的用户反馈",
        },
        template: "blue",
      },
      elements: [
        {
          tag: "div",
          fields: [
            {
              is_short: true,
              text: { tag: "lark_md", content: `**称呼**\n${data.name || "-"}` },
            },
            {
              is_short: true,
              text: { tag: "lark_md", content: `**单位**\n${data.organization || "-"}` },
            },
            {
              is_short: true,
              text: { tag: "lark_md", content: `**联系方式**\n${data.contact || "-"}` },
            },
            {
              is_short: true,
              text: { tag: "lark_md", content: `**TokenGO 用户名**\n${data.username || "-"}` },
            },
          ],
        },
        {
          tag: "div",
          text: { tag: "lark_md", content: `**反馈内容**\n${data.body}` },
        },
        {
          tag: "div",
          text: { tag: "lark_md", content: `**期望回复时间**\n${responseLabel}` },
        },
        {
          tag: "hr",
        },
        {
          tag: "note",
          elements: [
            {
              tag: "plain_text",
              content: `提交时间：${new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}`,
            },
          ],
        },
      ],
    },
  };
}

async function sendToFeishu(data: FeedbackPayload) {
  const webhookUrl = process.env.FEISHU_FEEDBACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn("[feedback] FEISHU_FEEDBACK_WEBHOOK_URL not configured, skipping notification");
    return;
  }

  const payload = buildFeishuCard(data);
  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("[feedback] Feishu webhook failed:", res.status, text);
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: FeedbackPayload = await request.json();

    if (!data.name?.trim() || !data.contact?.trim() || !data.body?.trim()) {
      return NextResponse.json(
        { error: "Name, contact, and message are required." },
        { status: 400 }
      );
    }

    // Fire-and-forget: send to Feishu without blocking the response
    sendToFeishu(data).catch((err) => {
      console.error("[feedback] Failed to send Feishu notification:", err);
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
}
