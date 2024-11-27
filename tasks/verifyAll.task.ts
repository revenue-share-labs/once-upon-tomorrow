export default (task: any) =>
  task('verifyAll', 'Tries to verify all the artifacts in the source folder of contracts using built-in verify task.').setAction(
    async (_: any, hre: any) => {
      const allArtifacts = await hre.run('getAllArtifacts');
      let currentCounter = 0;
      for (const artifactFullName of allArtifacts) {
        currentCounter++;
        if (!artifactFullName.startsWith('contracts')) continue;
        let artifactAddress: string;
        const artifactName = artifactFullName.split(':')[1];
        console.log(`${currentCounter}/${allArtifacts.length} - Trying to verify ${artifactName}...`);
        try {
          artifactAddress = (await hre.deployments.get(artifactName)).address;
        } catch {
          console.log(`Artifact is either non-deployable or not deployed: ${artifactName}. Skipping...`);
          continue;
        }
        try {
          await hre.run('verify', {
            address: artifactAddress,
          });
        } catch (e) {
          console.log(`Cannot verify ${artifactFullName} - ${artifactAddress}.`);
          console.log('Reason:');
          console.log(e);
          console.log('Continue...');
          continue;
        }
      }
      console.log('All artifacts possible has been verified.');
    },
  );
