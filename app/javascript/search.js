window.addEventListener('load', function() {
  const input = document.querySelector('input');
  const results = document.getElementById('results');

  input.addEventListener('input', performSearch);

  const baseUrl = 'https://api.edamam.com/api/recipes/v2'
  const appId = input.dataset.appid;
  const appKey = input.dataset.appkey;

  function performSearch(e) {
    results.textContent = '';
    if (e.target.value == '') return;
    input.disabled = true;
    const fullUrl = `${baseUrl}?q=${e.target.value}&app_id=${appId}&app_key=${appKey}&type=public&field=label&field=url`

    fetch(fullUrl).then(function(response) {
      return response.json();
    }).then(function(data) {
      if (data.hits.length == 0) {
        results.textContent = 'Didnt find anything... Please try different search term.'
      } else {
        if (data.hits.length == 20 && data._links.next.href) {
          fetchAdditionalResults(data._links.next.href, 10); // we do this because requirement is to show 30
                                                             // results but default is 20
        }
        data.hits.forEach(renderResult);
      }
    }).catch(function() {
      results.textContent = 'Too many request. Slow down.'
    }).finally(() => {
      input.disabled = false;
      input.focus();
    });
  }

  function renderResult(result) {
    results.innerHTML += `<li><a target='_blank' href='${result.recipe.url}'>${result.recipe.label}</a></li>`;
  }

  async function fetchAdditionalResults(url, num) {
    fetch(url).then(function(response) {
      return response.json();
    }).then(function(data) {
      data.hits.slice(0, num).forEach(renderResult);
    }).catch(function() {
      console.log('something went wrong. Check Network tab.')
    });
  }
});
