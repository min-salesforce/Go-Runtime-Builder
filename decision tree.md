# Salesforce Go Design Flow Guide

## Quick Start Decision Tree

### 1. What type of experience are you creating?

**If you're building:** → **Then follow flow:**
- Initial product setup or configuration → **Solutions/Initial Setup Flow**
- Standard feature introduction or walkthrough → **Standard Feature Flow** 
- AI agent setup, training, or deployment → **Agentforce Flow**
- Complex multi-step process → **Contact Go CX team for consultation**
- Custom pattern not covered here → **Contact Go CX team before proceeding**

---

## Flow 1: Solutions / Initial Setup

### Decision Points:
**If your setup involves:**
- Single product configuration → Use **Setup Wizard pattern**
- Multiple connected products → Use **Multi-product Setup pattern** 
- Data migration or import → Include **Data Import components**
- Admin vs end-user setup → Branch into **Role-specific paths**

### Content Requirements Checklist:
- [ ] Welcome/value proposition copy
- [ ] Step-by-step instructions with clear CTAs
- [ ] Success state messaging
- [ ] Troubleshooting guidance
- [ ] "What's next" recommendations

**→ Always coordinate with Go CX team for UI text and content strategy**

---

## Flow 2: Standard Feature Pages

### Decision Points:
**If your feature is:**
- Net-new to Salesforce → Use **Feature Introduction pattern**
- Enhancement to existing feature → Use **What's New pattern**
- Requires specific permissions → Include **Access Requirements component**
- Has prerequisites → Use **Prerequisite Checker pattern**

### Content Requirements Checklist:
- [ ] Feature benefit statement
- [ ] Use case examples
- [ ] Getting started steps
- [ ] Key concepts/terminology
- [ ] Success metrics guidance

**→ Consult CDX library first, then Go CX team for gaps**

---

## Flow 3: Agentforce

### Decision Points:
**If you're building for:**
- Agent creation/setup → Use **Agent Builder pattern**
- Agent training/knowledge → Use **Training Workflow pattern**
- Agent deployment → Use **Deployment Checklist pattern**
- Agent performance monitoring → Use **Analytics Dashboard pattern**

### Content Requirements Checklist:
- [ ] AI/agent-specific disclaimers
- [ ] Training data requirements
- [ ] Privacy/security considerations
- [ ] Performance expectations
- [ ] Monitoring and optimization guidance

**→ Mandatory Go CX consultation for all Agentforce content**

---

## Design Rubric: "If This, Then That"

### Content Quality
**If content is:** → **Then:**
- Customer-facing → Must be reviewed by Go CX team
- Technical/developer-focused → Include CDX consultation  
- AI/ML related → Requires legal/compliance review
- Multi-product → Coordinate across product teams

### Pattern Usage
**If you need:** → **Then:**
- Existing UI pattern → Check CDX library first
- New pattern → Propose to Go CX team before building
- Custom component → Document for future reuse
- Third-party integration → Follow security review process

### User Experience
**If users are:** → **Then:**
- First-time users → Include contextual help and definitions
- Power users → Provide advanced/shortcut options
- Mobile users → Ensure responsive design compliance
- International users → Plan for localization needs

### Success Measurement
**If your feature involves:** → **Then:**
- User onboarding → Define completion metrics
- Feature adoption → Set engagement benchmarks  
- Complex workflows → Include progress indicators
- Learning content → Track consumption analytics

---

## Escalation Guidelines

### Contact Go CX Team When:
- Content strategy is unclear
- Multiple user personas involved
- Cross-product dependencies exist
- Accessibility concerns arise
- Localization requirements exist
- Success metrics need definition

### Self-Service Resources:
- CDX component library
- Go pattern documentation
- Content style guide
- Accessibility checklist

---

## Key Principles

1. **Consistency First**: Use established patterns before creating new ones
2. **User-Centered**: Always start with user needs and context
3. **Collaborative**: Engage Go CX team early and often
4. **Measurable**: Define success criteria upfront
5. **Scalable**: Document decisions for future team reference

**Remember: It's always better to ask for guidance than to create inconsistent experiences. The Go CX team is here to help you succeed.**
