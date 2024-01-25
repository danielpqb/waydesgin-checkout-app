import type { ActionFunction } from "@remix-run/node";
import { useSubmit } from "@remix-run/react";
import React from "react";
import { authenticate } from "~/shopify.server";

type Props = {};

export const action: ActionFunction = async ({ request }) => {
  //TRIGGER WEBHOOK

  const { admin, session } = await authenticate.admin(request);
  const webhook = new admin.rest.resources.Webhook({ session: session });
  const { shop, accessToken } = session;
  console.log("@shop: " + shop);
  console.log("@accessToken: " + accessToken);

  if (webhook) {
    webhook.address = "pubsub://projectName:topicName";
    webhook.topic = "chekouts/update";
    webhook.format = "json";

    await webhook.save({ update: true });
  }
};

const AutomationsPage = (props: Props) => {
  const submit = useSubmit();
  const ready = () => submit({}, { replace: true, method: "POST" });
  return (
    <div onClick={ready}>
      <button>Gerar Token</button>
    </div>
  );
};
export default AutomationsPage;
