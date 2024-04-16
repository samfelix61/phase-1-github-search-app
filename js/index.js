document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('github-form');
    const userList = document.getElementById('user-list');
    const reposList = document.getElementById('repos-list');
  
    form.addEventListener('submit', async function(event) {
      event.preventDefault();
      const searchTerm = document.getElementById('search').value.trim();
      if (!searchTerm) {
        alert('Please enter a search term.');
        return;
      }
  
      try {
        const response = await fetch(`https://api.github.com/search/users?q=${searchTerm}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data from GitHub API.');
        }
        const userData = await response.json();
        displaySearchResults(userData.items);
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to fetch data from GitHub API.');
      }
    });
  
    function displaySearchResults(users) {
      userList.innerHTML = ''; // Clear previous search results
      users.forEach(user => {
        const userItem = document.createElement('li');
  
        // Create and add user avatar
        const avatar = document.createElement('img');
        avatar.src = user.avatar_url;
        avatar.alt = `${user.login} avatar`;
        avatar.classList.add('avatar');
        userItem.appendChild(avatar);
  
        // Create and add username
        const username = document.createElement('span');
        username.textContent = user.login;
        userItem.appendChild(username);
  
        // Create and add link to user profile
        const link = document.createElement('a');
        link.href = user.html_url;
        link.textContent = 'Profile';
        link.target = '_blank'; // Open in a new tab
        userItem.appendChild(link);
  
        // Add event listener to fetch and display user repositories on click
        userItem.addEventListener('click', async () => {
          try {
            const reposResponse = await fetch(`https://api.github.com/users/${user.login}/repos`);
            if (!reposResponse.ok) {
              throw new Error('Failed to fetch repositories for the user.');
            }
            const reposData = await reposResponse.json();
            displayUserRepositories(reposData);
          } catch (error) {
            console.error('Error:', error);
            alert('Failed to fetch repositories for the user.');
          }
        });
  
        userList.appendChild(userItem);
      });
    }
  
    function displayUserRepositories(repositories) {
      reposList.innerHTML = ''; // Clear previous repositories
      repositories.forEach(repo => {
        const repoItem = document.createElement('li');
        const repoLink = document.createElement('a');
        repoLink.href = repo.html_url;
        repoLink.textContent = repo.name;
        repoLink.target = '_blank'; // Open in a new tab
        repoItem.appendChild(repoLink);
        reposList.appendChild(repoItem);
      });
    }
  });