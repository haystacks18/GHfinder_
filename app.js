document.getElementById('search-btn').addEventListener('click', findUser);

function handleKeypress(event) {
    if (event.key === 'Enter') {
        findUser();
    }
}

async function findUser() {
    const username = document.getElementById('search-user').value.trim();
    if (!username) {
        displayError('Please enter a GitHub username.');
        return;
    }

    try {
        const profileResponse = await fetch(`https://api.github.com/users/${username}`);
        if (!profileResponse.ok) throw new Error('User not found');
        const profile = await profileResponse.json();
        displayProfile(profile);
        fetchRepos(username);
    } catch (error) {
        displayError(error.message);
    }
}

async function fetchRepos(username) {
    try {
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos`);
        if (!reposResponse.ok) throw new Error('Repositories not found');
        const repos = await reposResponse.json();
        displayRepos(repos);
    } catch (error) {
        displayError(error.message);
    }
}

function displayRepos(repos) {
    let reposHTML = '<h2>Latest Repositories</h2>';
    reposHTML += repos.map(repo => `
        <div class="repo">
            <div class="repo-name">
                <a href="${repo.html_url}" target="_blank">${repo.name}</a>
            </div>
            <div class="repo-info">
                <a href="${repo.html_url}/stargazers" target="_blank" class="button">Stars: ${repo.stargazers_count}</a>
                <a href="${repo.html_url}/network/members" target="_blank" class="button">Forks: ${repo.forks_count}</a>
                <a href="${repo.html_url}/watchers" target="_blank" class="button">Watchers: ${repo.watchers_count}</a>
            </div>
        </div>
    `).join('');
    document.getElementById('repos').innerHTML = reposHTML;
}

function displayProfile(user) {
    let blog = user.blog ? `<span class="blog-text">${user.blog}</span>` : 'No blog';

    const profileHTML = `
        <div class="profile-header">
            <img src="${user.avatar_url}" alt="${user.login}" class="avatar">
            <h2>${user.name || user.login}</h2>
            <ul>
                <li><a href="${user.html_url}?tab=repositories" class="profile-stat repos" target="_blank">${user.public_repos} Repos</a></li>
                <li><a href="${user.html_url}?tab=gists" class="profile-stat gists" target="_blank">${user.public_gists} Gists</a></li>
                <li><a href="${user.html_url}?tab=followers" class="profile-stat followers" target="_blank">${user.followers} Followers</a></li>
                <li><a href="${user.html_url}?tab=following" class="profile-stat following" target="_blank">${user.following} Following</a></li>
            </ul>
            ${blog}
        </div>
        <div class="profile-stats">
            <!-- Stats buttons go here -->
        </div>
        <a href="${user.html_url}" target="_blank" class="view-profile">View Profile on GitHub</a>
    `;
    document.getElementById('profile').innerHTML = profileHTML;
}
