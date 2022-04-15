window.addEventListener("load", function() {
  const input = document.querySelector('input');
  const results = document.getElementById('results');

  input.addEventListener('input', performSearch);

  const baseUrl = 'https://api.edamam.com/api/recipes/v2'
  const appId = input.dataset.appid;
  const appKey = input.dataset.appkey;

  function performSearch(e) {
    results.textContent = '';
    const fullUrl = `${baseUrl}?q=${e.target.value}&app_id=${appId}&app_key=${appKey}&type=public&field=label&field=url`

    fetch(fullUrl).then(function(response) {
      return response.json();
    }).then(function(data) {
      data.hits.forEach(renderResult);;
    }).catch(function() {
      console.log("Something went wrong");
    });
  }

  function renderResult(result) {
    results.append(result.recipe.label);
  }
});
