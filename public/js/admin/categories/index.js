const actionsForms = document.querySelectorAll('.actions-form')

actionsForms.forEach(form => {
    form.onsubmit = function(event) {
        event.preventDefault()
        
        const decision = confirm("Are you sure you want to delete?")

        if (!decision) return

        this.submit()
    }
})