const searchForm = document.querySelector('form');
const rTemp = document.querySelector('template');
const resultArea = document.querySelector('#restaurant-results');
const resultFooter = document.getElementById("id01");


searchForm.addEventListener('submit', async e => {
  e.preventDefault();
  resultArea.innerHTML = '';
  var query = e.target.querySelector('#inputtext').value;

  const res1 = await fetch('https://developers.zomato.com/api/v2.1/cities?q=' + query, {
    headers: {
      "user-key": "fc305fe00d927c65c5e98f32fc535b7b",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: 'POST'
  })
  const cityResponse = await res1.json();
  
  if(cityResponse.location_suggestions == ''){
    alert('Error: City not in database.');
    return
  }else{
    var searchCity = "entity_id=" + cityResponse.location_suggestions[0].id  +"&entity_type=city";// + query;
  }
  if (query === '') {
    return
  }
  const res = await fetch('https://developers.zomato.com/api/v2.1/search?' + searchCity, {
    headers: {
      "user-key": "fc305fe00d927c65c5e98f32fc535b7b",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: 'POST'
  })
  const json = await res.json();
  
  populateData(json.restaurants);
});

function populateData(results) {
  
  results.forEach(result => {
    //console.log(result);
    const newResult = rTemp.content.cloneNode(true);
    newResult.querySelector('.result-title').innerText = result.restaurant.name;
    newResult.querySelector('.result-neighborhood').innerText = result.restaurant.location.locality;
    newResult.querySelector('.result-address').innerText = result.restaurant.location.address;
    newResult.querySelector('.result-price').innerText = "Cost: " + '$'.repeat(result.restaurant.price_range);
    newResult.querySelector('.result-thumbnail').src = result.restaurant.thumb;
    newResult.getElementById('result-button').setAttribute( "onClick", "window.open('" + result.restaurant.url + "','_blank')");
    newResult.querySelector('.result-number').innerText = "Phone Number: " + result.restaurant.phone_numbers;
    newResult.querySelector('.result-rating').innerText = result.restaurant.user_rating.aggregate_rating;
    //newResult.getElementById("result-rating").style.backgroundColor = result.restaurant.user_rating.rating_color;
    newResult.querySelector('.result-timings').innerText = "Hours: " + result.restaurant.timings;
   //resultFooter.innerHTML = '<button class="result-footer-button">Visit Website</button>';
    resultArea.appendChild(newResult);
  });
}