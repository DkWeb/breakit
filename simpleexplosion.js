var simpleExplosionGenerator = function() {
    return {
        startExplosion: function(durationInFrames, startParticleCount, posX, posY) {
            var explosion = {
                startFrame: 0,
                curFrame: 0,
                endFrame: durationInFrames - 1,
                startParticleCount: startParticleCount,
                particles: [],
                particlesTotal: startParticleCount // For debugging purposes
            }
            for (var i = 0; i < startParticleCount; i++) {
                var randomAngleInRad = createRandomAngleInRad();
                explosion.particles.push(
                    createParticle(0, 
                                getRandomIntInclusive(1, durationInFrames - 1), 
                                posX,
                                posY,
                                calcSpeedX(randomAngleInRad), 
                                calcSpeedY(randomAngleInRad)));
            }
            return explosion;
        },

        updateNewFrame: function(explosion) {
            explosion.curFrame++;
            removeOutdated(explosion);
            updatePositions(explosion);
            spawnNewParticles(explosion); 
            return explosion.curFrame <= explosion.endFrame;
        }
    };

    function createRandomAngleInRad() {
        return degToRad(Math.random() * 360);
    }

    function createParticle(aStartFrame, aEndFrame, aPosX, aPosY, aSpeedX, aSpeedY) {
        return {
            startFrame: aStartFrame,
            endFrame: aEndFrame,
            posX: aPosX,
            posY: aPosY,
            speedX: aSpeedX,
            speedY: aSpeedY 
        };
    }

    function removeOutdated(explosion) {
        var remainingParticles = [];
        for (var i = 0; i < explosion.particles.length; i++) {
            var particle = explosion.particles[i];
            if (particle.endFrame >= explosion.curFrame) {
                remainingParticles.push(particle);
            }
        }        
    }

    function updatePositions(explosion) {
        for (var i = 0; i < explosion.particles.length; i++) {
            var particle = explosion.particles[i];
            particle.posX += particle.speedX;
            particle.posY += particle.speedY;
        }   
    }

    function spawnNewParticles(explosion) {
        var curFrame = explosion.curFrame;
        var newParticles = [];
        // Each and every particle has the chance to create new particles
        for (var i = 0; i < explosion.particles.length; i++) {
            // Later updates will result in a lower probability to create new particles at all
            // -> create a bigger range of possible numbers. We will just create a new explosion when we have created the random number "1"
            var randomNum = getRandomIntInclusive(0, curFrame * 50);
            if (randomNum === 1) {
                // Later updates will create a smaller number of additional particles per particle
                // var newParticlesCount = Math.ceil((explosion.startParticleCount - getRandomIntInclusive(0, explosion.startParticleCount) / Math.min(2, curFrame)));
                var newParticlesCount = Math.ceil(explosion.startParticleCount /  Math.max(2, curFrame));
                // console.log("New particles:" + newParticlesCount);
                for (var j = 0; j < newParticlesCount; j++) {
                    var randomAngleInRad = createRandomAngleInRad();
                    newParticles.push(createParticle(curFrame, 
                                                        getRandomIntInclusive(curFrame, explosion.endFrame),
                                                        explosion.particles[i].posX,
                                                        explosion.particles[i].posY,
                                                        calcSpeedX(randomAngleInRad),
                                                        calcSpeedY(randomAngleInRad)));
                    explosion.particlesTotal++;
                }
            }
        }
        for (var i = 0; i < newParticles.length; i++) {
            explosion.particles.push(newParticles[i]);
        }
    }

    function calcSpeedX(randomAngleInRad) {
        return Math.sin(randomAngleInRad);
    }

    function calcSpeedY(randomAngleInRad) {
        return Math.cos(randomAngleInRad);
    }

    function degToRad(deg) {
        return (Math.PI * deg) / 180;
    }

    // Source: https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Math/math.random
    function getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min +1)) + min; 
      } 
}();