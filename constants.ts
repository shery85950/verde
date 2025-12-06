export const PAPER_CONTENT = `
Abstract
Machine learning programs, such as those performing inference, fine-tuning, and training of LLMs, are commonly delegated to untrusted compute providers. To provide correctness guarantees for the client, we propose adapting the cryptographic notion of refereed delegation to the machine learning setting... [Full paper content truncated for brevity in code, but conceptually included for the AI context]
...
(The full text provided in the prompt is available to the AI service via context, we will use a summarized context for the prompt).
`;

export const SUMMARY_CONTEXT = `
You are an expert AI assistant explaining the "Verde" research paper. 
Verde is a system for "Refereed Delegation" of Machine Learning.
Key Concepts:
1. Clients delegate ML tasks to multiple servers (trainers).
2. If servers agree, great. If they disagree, a "Referee" is needed.
3. Challenge 1: Dispute Resolution. 
   - Phase 1: Binary search on training steps (checkpoints) to find the first divergent step.
   - Phase 2: Binary search on the computational graph (operators) within that step to find the specific operation.
4. Challenge 2: Hardware Non-determinism (Floating point math is not associative).
   - Solution: RepOps (Reproducible Operators) library. Enforces order of operations to ensure bitwise reproducibility across different GPUs.
`;
