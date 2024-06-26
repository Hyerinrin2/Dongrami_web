document.addEventListener("DOMContentLoaded", function() {
    const voteListDiv = document.getElementById('vote-list');
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    function fetchVoteById(id) {
		
        fetch(`/api/votes`+ id)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch vote');
                }
                return response.json();
            })
            .then(vote => {
			
                const voteDiv = createVoteElement(vote);
                voteListDiv.appendChild(voteDiv);
            })
            .catch(error => {
                console.error('Error fetching vote:', error);
            });
    }

    function createVoteElement(vote) {
        const voteDiv = document.createElement('div');
        voteDiv.classList.add('vote-item');

        voteDiv.innerHTML = `
            <h2>${vote.question}</h2>
            <img src="${vote.voteImage}" alt="Vote Image">
            <p>${vote.option1}</p>
            <p>${vote.option2}</p>
        `;

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        const button1 = document.createElement('button');
        button1.textContent = 'Option 1';
        button1.addEventListener('click', function() {
            voteOption(vote.id, 'option1');
            button1.classList.add('selected');
            button2.classList.remove('selected');
        });

        const button2 = document.createElement('button');
        button2.textContent = 'Option 2';
        button2.addEventListener('click', function() {
            voteOption(vote.id, 'option2');
            button2.classList.add('selected');
            button1.classList.remove('selected');
        });

        buttonContainer.appendChild(button1);
        buttonContainer.appendChild(button2);
        voteDiv.appendChild(buttonContainer);

        const barContainer1 = document.createElement('div');
        barContainer1.classList.add('bar-container1');
        barContainer1.id = `barContainer1_${vote.id}`;
        barContainer1.innerHTML = `
            <div class="bar1" id="bar1_${vote.id}"></div>
            <span class="text-left">A</span>
            <span class="percentage" id="percentage1_${vote.id}"></span>
        `;
        voteDiv.appendChild(barContainer1);

        const barContainer2 = document.createElement('div');
        barContainer2.classList.add('bar-container2');
        barContainer2.id = `barContainer2_${vote.id}`;
        barContainer2.innerHTML = `
            <div class="bar2" id="bar2_${vote.id}"></div>
            <span class="text-left">B</span>
            <span class="percentage" id="percentage2_${vote.id}"></span>
        `;
        voteDiv.appendChild(barContainer2);

        const replyContainer = document.createElement('div');
        replyContainer.classList.add('reply-container');
        const replyButton = document.createElement('button');
        replyButton.textContent = 'View Replies';
        replyButton.addEventListener('click', function() {
            window.location.href = `/mainvote?id=${vote.id}`;
        });
        replyContainer.appendChild(replyButton);
        voteDiv.appendChild(replyContainer);

        return voteDiv;
    }

    window.voteOption = function(voteId, option) {
        fetch(`/api/votes/${voteId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ option: option }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to vote');
            }
            return response.json();
        })
        .then(updatedVote => {
            console.log('Vote successful:', updatedVote);
            updateVoteResults(updatedVote);
        })
        .catch(error => {
            console.error('Error voting:', error);
        });
    };

    function updateVoteResults(vote) {
        const totalVotes = vote.option1Count + vote.option2Count;
        const percentage1 = totalVotes === 0 ? 0 : Math.round((vote.option1Count / totalVotes) * 100);
        const percentage2 = totalVotes === 0 ? 0 : Math.round((vote.option2Count / totalVotes) * 100);

        const percentage1Elem = document.getElementById(`percentage1_${vote.id}`);
        const percentage2Elem = document.getElementById(`percentage2_${vote.id}`);
        const bar1 = document.getElementById(`bar1_${vote.id}`);
        const bar2 = document.getElementById(`bar2_${vote.id}`);

        percentage1Elem.textContent = `${percentage1}%`;
        percentage2Elem.textContent = `${percentage2}%`;

        bar1.style.width = `${percentage1}%`;
        bar2.style.width = `${percentage2}%`;
    }

    // 초기 로드 시 fetchVoteById 호출
    fetchVoteById(id);
});
