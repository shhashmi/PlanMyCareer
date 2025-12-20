import { Octokit } from '@octokit/rest'
import { execSync } from 'child_process'

async function getConnectionData() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('Replit token not found');
  }

  const response = await fetch(
    `https://${hostname}/api/v2/connection?include_secrets=true&connector_names=github`,
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  );
  
  const data = await response.json();
  return data.items?.[0];
}

async function main() {
  try {
    console.log('Getting GitHub connection...');
    const connection = await getConnectionData();
    
    if (!connection) {
      throw new Error('GitHub not connected. Please set up the GitHub connection.');
    }
    
    const accessToken = connection.settings?.access_token 
      || connection.settings?.oauth?.credentials?.access_token;
    
    if (!accessToken) {
      throw new Error('No access token found');
    }
    
    console.log('Token found, creating GitHub client...');
    const octokit = new Octokit({ 
      auth: accessToken,
      request: {
        timeout: 10000
      }
    });
    
    console.log('Fetching authenticated user...');
    const { data: user } = await octokit.users.getAuthenticated();
    console.log(`Authenticated as: ${user.login}`);
    
    const repoName = 'ai-skillgap';
    
    let repoExists = false;
    try {
      await octokit.repos.get({ owner: user.login, repo: repoName });
      repoExists = true;
      console.log(`Repository ${repoName} already exists`);
    } catch (e) {
      if (e.status !== 404) throw e;
    }
    
    if (!repoExists) {
      console.log(`Creating repository: ${repoName}...`);
      await octokit.repos.createForAuthenticatedUser({
        name: repoName,
        description: 'AI Skill Gap Analysis - Identify AI skill gaps and get personalized upskilling plans',
        private: false
      });
      console.log('Repository created!');
    }
    
    console.log('Setting up git remote...');
    const remoteUrl = `https://${user.login}:${accessToken}@github.com/${user.login}/${repoName}.git`;
    
    try {
      execSync('git remote remove origin 2>/dev/null || true', { shell: true });
    } catch (e) {}
    
    execSync(`git remote add origin "${remoteUrl}"`, { stdio: 'inherit' });
    
    console.log('Pushing code to GitHub...');
    execSync('git push -u origin main --force', { stdio: 'inherit' });
    
    console.log(`\nSuccess! Your code is now at: https://github.com/${user.login}/${repoName}`);
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    process.exit(1);
  }
}

main();
