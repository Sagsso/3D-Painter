class CollidableBox {
    constructor(mesh, boundingRadius) {
        this.mesh = mesh;
        this.collidableRadius = boundingRadius;
        this.isFalling = { state: false, acc: 0 };
        // this.initBoundingMesh(this.mesh);
    }

    initBoundingMesh(mesh) {
        console.log(mesh);
        this.collidableRadius = mesh.geometry.boundingSphere.radius;
    }


    collide(normal, callback, verticalColliding = false, player) {
        // let animateInmune = (player) => {
        //     while (player.inmune) {
        //         if (player.element.material.opacity == 1) {
        //             console.log('Animating opacity')
        //             TweenLite.to(player.element.material, 1, { opacity: 0 });
        //         }
        //         else if (player.element.material.opacity == 0) {
        //             TweenLite.to(player.element.material, 1, { opacity: 1 });
        //         }
        //     }
        // }
        let collidableRay = new THREE.Raycaster();
        collidableRay.ray.direction.set(normal.x, normal.y, normal.z);

        let origin = this.mesh.position.clone();
        collidableRay.ray.origin.copy(origin);

        let intersections = collidableRay.intersectObjects(collidableList);
        // let intersectPowerUps = collidableRay.intersectObjects(powerUpList);

        if (verticalColliding) {
            if (intersections.length > 0) {
                callback(intersections);
            } else {
                this.isFalling.state = true;
                this.isFalling.acc += 1;
                this.mesh.position.y -= 1 * this.isFalling.acc;
            }
        } else {
            if (intersections.length > 0) {
                let distance = intersections[0].distance;
                if (distance < this.collidableRadius) {
                    switch (intersections[0].object.name) {
                        case "Velocity2X":
                            // console.log(collidableList);
                            var pos = collidableList.indexOf(intersections[0].object);
                            // console.log(pos);
                            collidableList.splice(pos, 1);
                            scene.remove(intersections[0].object);
                            // console.log("removido")
                            // console.log(collidableList);
                            if (player.vx < 12) {
                                player.vx += 1;
                            }
                            var powerupSound = new Sound(["./assets/songs/powerup.wav"]);
                            powerupSound.play();
                            break;
                        case "Bomb+":
                            var pos = collidableList.indexOf(intersections[0].object);
                            collidableList.splice(pos, 1);
                            scene.remove(intersections[0].object);
                            player.control.capacityBombs += 1;
                            console.log(player.control.capacityBombs);
                            var powerupSound = new Sound(["./assets/songs/powerup.wav"]);
                            powerupSound.play();
                            break;
                        case "Potencia":
                            var pos = collidableList.indexOf(intersections[0].object);
                            collidableList.splice(pos, 1);
                            scene.remove(intersections[0].object);
                            player.potenciaBomba += 1;
                            var powerupSound = new Sound(["./assets/songs/powerup.wav"]);
                            powerupSound.play();
                            break;
                        case "Capa":
                            var pos = collidableList.indexOf(intersections[0].object);
                            collidableList.splice(pos, 1);
                            scene.remove(intersections[0].object);
                            player.inmune = true;
                            console.log(player.control.capacityBombs);
                            var powerupSound = new Sound(["./assets/songs/powerup.wav"]);
                            powerupSound.play();
                            setTimeout(function () { player.inmune = false }, 10000);

                            break;
                        case "Snitch":
                            var pos = collidableList.indexOf(intersections[0].object);
                            collidableList.splice(pos, 1);
                            scene.remove(intersections[0].object);
                            player.score += 500;
                            console.log(player.score);
                            var powerupSound = new Sound(["./assets/songs/powerup.wav"]);
                            powerupSound.play();
                            break;
                        case "thanos":
                            this.mesh.material.color = new THREE.Color("0xffffff")
                            break;
                        default:
                            callback();
                            break;
                    }
                }
            }
        }

    }
    collideLeft(player) {
        let callback = () => {
            this.mesh.position.x -= player.control.velocity;
        }
        this.collide({ x: 1, y: 0, z: 0 }, callback, false, player);
    }

    collideRight(player) {
        let callback = () => {
            this.mesh.position.x += player.control.velocity;
        }
        this.collide({ x: -1, y: 0, z: 0 }, callback, false, player);
    }
    collideFront(player) {
        let callback = () => {
            this.mesh.position.z -= player.control.velocity;
        }
        this.collide({ x: 0, y: 0, z: 1 }, callback, false, player);
    }

    collideBack(player) {
        let callback = () => {
            this.mesh.position.z += player.control.velocity;
        }
        this.collide({ x: 0, y: 0, z: -1 }, callback, false, player);
    }

    collideBottom(player) {

        let callback = (intersections) => {
            let distance = intersections[0].distance;
            //console.log(`distance: ${distance} CR: ${this.collidableRadius}`)
            if (distance > this.collidableRadius) { //inAir
                this.isFalling.state = true;
                this.isFalling.acc += 0.2;
                this.mesh.position.y -= 1 * this.isFalling.acc;
                //console.log("in air")

                player.control.isInAir = true;

            }
            if (distance <= this.collidableRadius + 1) { //over the floor
                //console.log("over the floor")
                player.control.isJumping = false;
                player.control.isInAir = false;
                this.isFalling.state = false;
                this.isFalling.acc = 0;
                if (distance < this.collidableRadius) {
                    this.mesh.position.y += 1 / 2;
                }
                switch (intersections[0].object.name) {
                    case "plataforma1":
                        if (elevacion.position.y < 200) {
                            elevacion.isInUse = true;
                            elevacion.position.y += 1 / 2;
                        }
                        break;
                    case "plataforma2":
                        if (elevacion2.position.y < 200) {
                            elevacion2.isInUse = true;
                            elevacion2.position.y += 1 / 2;
                        }
                        break;
                    case "plataforma3":
                        if (elevacion3.position.y < 200) {
                            elevacion3.isInUse = true;
                            elevacion3.position.y += 1 / 2;
                        }
                        break;
                    case "plataforma4":
                        if (elevacion4.position.y < 200) {
                            elevacion4.isInUse = true;
                            elevacion4.position.y += 1 / 2;
                        }
                        break;
                    case "thanos":
                        this.mesh.material.color = new THREE.Color("0xffffff")
                        break;
                }
            } else {
                elevacion.isInUse = false;
                elevacion2.isInUse = false;
                elevacion3.isInUse = false;
                elevacion4.isInUse = false;
            }


        }
        this.collide({ x: 0, y: -1, z: 0 }, callback, true);
    }

    update(player) {
        this.collideLeft(player);
        this.collideRight(player);
        this.collideFront(player);
        this.collideBack(player);
        this.collideBottom(player);
        if (player.inmune) {
            if (player.element.material.opacity == 1) {
                console.log('Animating opacity')
                TweenLite.to(player.element.material, 0.2, { opacity: 0 });
            }
            else if (player.element.material.opacity == 0) {
                TweenLite.to(player.element.material, 0.2, { opacity: 1 });
            }
        }
        if (!player.inmune && player.element.material.opacity == 0) {
            player.element.material.opacity = 1;
        }
    }
}