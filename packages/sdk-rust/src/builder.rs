use crate::errors::ProvaError;
use crate::types::{ActionType, AttestationPayload};
use serde_json::{json, Value};

#[derive(Default)]
pub struct AttestationBuilder {
    action_type: Option<ActionType>,
    payload: Option<Value>,
    metadata: Option<Value>,
}

impl AttestationBuilder {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn action_type(mut self, t: ActionType) -> Self {
        self.action_type = Some(t);
        self
    }

    pub fn payload(mut self, p: Value) -> Self {
        self.payload = Some(p);
        self
    }

    pub fn metadata(mut self, m: Value) -> Self {
        self.metadata = Some(m);
        self
    }

    pub fn build(self) -> Result<AttestationPayload, ProvaError> {
        Ok(AttestationPayload {
            action_type: self.action_type.ok_or_else(|| ProvaError::RpcError("action_type required".into()))?,
            payload: self.payload.ok_or_else(|| ProvaError::RpcError("payload required".into()))?,
            metadata: self.metadata,
        })
    }

    pub fn transaction(tx_sig: &str) -> Result<AttestationPayload, ProvaError> {
        Self::new().action_type(ActionType::Transaction).payload(json!({ "tx_signature": tx_sig })).build()
    }

    pub fn tool_call(tool: &str, args: Value) -> Result<AttestationPayload, ProvaError> {
        Self::new().action_type(ActionType::ToolCall).payload(json!({ "tool_name": tool, "args": args })).build()
    }

    pub fn model_invocation(model: &str, prompt_hash: &str) -> Result<AttestationPayload, ProvaError> {
        Self::new().action_type(ActionType::ModelInvocation).payload(json!({ "model": model, "prompt_hash": prompt_hash })).build()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn transaction_builder_works() {
        let p = AttestationBuilder::transaction("sig123").unwrap();
        assert_eq!(p.action_type, ActionType::Transaction);
        assert_eq!(p.payload["tx_signature"], "sig123");
    }

    #[test]
    fn missing_action_type_fails() {
        assert!(AttestationBuilder::new().payload(json!({})).build().is_err());
    }

    #[test]
    fn tool_call_builder_works() {
        let p = AttestationBuilder::tool_call("search", json!({})).unwrap();
        assert_eq!(p.action_type, ActionType::ToolCall);
    }
}
