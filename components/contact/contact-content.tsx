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
            Use the message form below to reach Compfi with details about the furniture you
            are considering and the room you are planning.
          </p>
          <p className="type-body text-muted-foreground">
            Your message is stored for the Compfi team to review and answer by email.
          </p>
        </section>
        <ContactForm />
      </div>
    </Container>
  )
}
