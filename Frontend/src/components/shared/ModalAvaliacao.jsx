import React, { useState } from 'react'
import { FiStar } from 'react-icons/fi'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Textarea from '../ui/Textarea'

export default function ModalAvaliacao({ open, onClose, onSubmit }) {
  const [stars, setStars] = useState(5)
  const [feedback, setFeedback] = useState('')

  return (
    <Modal open={open} onClose={onClose} title="Avalie o serviço">
      <div className="space-y-4">
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <button key={index} type="button" className="text-3xl" onClick={() => setStars(index + 1)}>
              <FiStar className={index < stars ? 'fill-warning text-warning' : 'text-line'} />
            </button>
          ))}
        </div>
        <Textarea label="Feedback" value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Como foi sua experiência?" />
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={() => onSubmit?.({ estrelas: stars, feedback })}>Enviar</Button>
        </div>
      </div>
    </Modal>
  )
}
