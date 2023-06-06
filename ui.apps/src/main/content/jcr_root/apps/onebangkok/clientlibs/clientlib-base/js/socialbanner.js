// const __getSocialMediaImage = () => {

//     var current_page=window.location.href;
//     var current_page_split = current_page.split(".html");
//     var socialbanner = document.getElementsByClassName("socialbanner").length;
//     if(socialbanner > 0) {
//     axios.get(current_page_split[0] +'/jcr:content/root/container/socialbanner.model.json').then((res) => {
//         var data_response_iterator = res["data"];
//         var imagedetails_response_iterator = JSON.parse(data_response_iterator.imagedetails);
//         const galleryElement = document.getElementById('social-media-images')
//         galleryElement &&
//             _.forEach(_.slice(imagedetails_response_iterator, 0, 10), (item) => {
//                 const imageWrapper = document.createElement('div')
//                 imageWrapper.className = 'image-layout__item--masonry'
//                 const image = document.createElement('img')
//                 image.src = item.url
//                 imageWrapper.appendChild(image)
//                 galleryElement.appendChild(imageWrapper)
//             })

//     })
// }

// }