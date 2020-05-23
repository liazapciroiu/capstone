const toggleForm = (event) => {
  const form = document.getElementById('form');
  form.style.display === 'block' ? form.style.display = 'none' : form.style.display = 'block';
}

export { toggleForm }