$(document).ready(function() {
    $('#searchForm').on('submit', function(e){
        e.preventDefault();
        var container = $('#mainContainer');
        container.empty();  // Clear the current content
        var searchInput = $('#searchInput').val();
        var url = 'http://localhost:3000/search?name=' + searchInput;
        const newUrl = `/search?name=${searchInput.replace(/ /g, '+')}`;
        history.pushState({ searchInput: searchInput.replace(/ /g, '+')}, '', newUrl);
        $.ajax({
            url: url,
            method: 'POST',
            success: function(data) {
                var novelsResult = data.searchResult;  // Adjust according to the structure of the response
                console.log(novelsResult)
            
                if(novelsResult.length==0){
                    var novelHtml = `
                    <h2 class="my-4">Danh sách truyện</h2>
                            <div class="row" id="novel-list">
                                No result or Search string is too short 
                            </div>
                    `;
                    container.append(novelHtml);
                }
                else{
                    var novelHtml = `
                    <h2 class="my-4">Danh sách truyện</h2>
    <div class="row" id="novel-list">`
                    novelsResult.forEach(function(novel) {
                        novelHtml += `
                            <div class="col-md-2 novel-card">
        <div class="card">
                    <img src="${novel.image}" class="card-img-top" alt="${novel.title}">
                    <div class="novel-info">
                        <h5 class="novel-title"><a href="${novel.slug}">${novel.title}</a></h5>
                        <p class="novel-author">Tác giả: ${novel.author}</p>
                        <p class="novel-chapter">Chương mới nhất: ${novel.chapter}</p>
                    </div>
        </div>
    </div>
                        `;
                    });
                    novelHtml +=  `</div>`;
                    container.append(novelHtml);
                }
                
            },
            error: function(err) {
                console.error('Error loading content:', err);
            }
        });
    });
});