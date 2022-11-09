function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');


document.addEventListener('DOMContentLoaded',function(){

    form_edit = document.querySelector('#editing');
    form_edit.style.display = 'none';
    client_info = document.querySelector('#info');
    client_info.style.display = 'block';
    edit_button = document.querySelector('#edit');
    edit_button.addEventListener('click',show_form)
    save_button = document.querySelector("#save");
    save_button.addEventListener('click',info)
});

function show_form(){
    console.log("show form");
    form_edit.style.display = 'block';
    client_info.style.display = 'none';
}

function info(evt){
    const username = JSON.parse(document.getElementById('username').textContent);
    console.log(username)
    const request = new Request(
        `/profile/edit/${username}`,
        {headers: {'X-CSRFToken': csrftoken}}
    );
    
    new_username = document.querySelector(`#id_username`).value;
    email = document.querySelector(`#id_email`).value;
    calories = document.querySelector(`#id_calories`).value;
    carbs = document.querySelector(`#id_carbs`).value;
    protein = document.querySelector(`#id_protein`).value;
    fat = document.querySelector(`#id_fat`).value;
    picture_name = document.querySelector(`#id_picture`).files[0].name;
    picture = `media/${picture_name}`;

    json_body = JSON.stringify({
        username: new_username,
        email: email,
        calories: calories,
        carbs: carbs,
        protein: protein,
        fat: fat,
    })

    formData = new FormData()
    formData.append("picture",document.querySelector('#id_picture').files[0]);
    formData.append("body",json_body);
    
   

    fetch(request,{
        method: 'POST',
        mode: "same-origin",
        body: formData
    })
    .then(() => 
        fetch(`/profile/edit/${username}`))
        .then(response => response.json())
        .then(client => {
            document.querySelector('#username_info').innerHTML = client.username;
            document.querySelector('#email').innerHTML = client.email;
            document.querySelector('#calories').innerHTML = `${client.calories} cal`;
            document.querySelector('#carbs').innerHTML = `${client.carbs} cal`;
            document.querySelector('#protein').innerHTML = `${client.protein} cal`;
            document.querySelector('#fat').innerHTML = `${client.fat} cal`;
            if(client.profile_pic)
            {
                document.querySelector('#profile_pic').src = client.profile_pic;
            }
            else
            {
                document.querySelector("#profile_pic").src = "/media/media/pobrane.png";
            }
            form_edit.style.display = 'none';
            client_info.style.display = 'block';
        })
    
    evt.preventDefault();
}
