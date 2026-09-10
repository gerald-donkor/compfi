import { Container } from "@/components/layout/container"
import { ContactForm } from "@/components/contact/contact-form"

export function ContactContent() {
  return (
    <Container className="contact-content">
      <div className="contact-layout">
        <section aria-labelledby="contact-details-heading" className="contact-details">
          <h2 id="contact-details-heading" className="type-heading-lg">
            Questions about furniture or your space?
          </h2>
          <p className="type-body text-muted-foreground">
            Use the message form to review what you would share with Compfi, such as the
            furniture you are considering and the room you are planning.
          </p>
          <p className="type-body text-muted-foreground">
            This preview checks your details in your browser only. Nothing is sent,
            stored, or emailed.
          </p>
        </section>
        <ContactForm />
      </div>
    </Container>
  )
}
