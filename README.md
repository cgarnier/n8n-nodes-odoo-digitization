# n8n-nodes-odoo-digitization

This is an n8n community node. It lets you use odoo digitization in your n8n workflows.

Odoo digitization is the automated vendor bill parser of Odoo. It allow you to upload a bill then odoo will parse it 
with AI and automatically fill the invoice data. It's part of Odoo 19+ accounting app.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Usage](#usage)
[Resources](#resources)
[Version history](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

* Trigger digitization: Trigger the digitization for the given `account.move id`. The `account.move` item must have a main attachment.

## Credentials

It s the same credentials then the official Odoo node.
* db name
* username
* password: Api key that you can generate in Odoo. Click your name > My preferences > API key
* url: Your odoo instance url (cloud: http://my-org.odoo.com)


## Compatibility

Tested with: `n8n@1.119.1`

## Usage

This node works with the accounting app of Odoo.
The `account.move` item must have a main attachment if you want to trigger a digitization.

Example of workflow:
- Create a bill (`account.move`)
- Create an attachment (`ir.attachment`) with bill id as `res` 
- Set the attachment as main attachement (update `account.move` with `message_main_attachment_id` = attachment id)
- Trigger the digitization with this node.
