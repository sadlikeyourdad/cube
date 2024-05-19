// Initialize Ammo.js
Ammo().then(start);

function start() {
    // Physics variables
    let collisionConfiguration;
    let dispatcher;
    let broadphase;
    let solver;
    let physicsWorld;

    // Graphics variables
    let scene;
    let camera;
    let renderer;
    let cubeMesh;
    let transformAux1;

    initPhysics();
    initGraphics();
    createCube();
    animate();

    function initPhysics() {
        collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
        dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
        broadphase = new Ammo.btDbvtBroadphase();
        solver = new Ammo.btSequentialImpulseConstraintSolver();
        physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, broadphase, solver, collisionConfiguration);
        physicsWorld.setGravity(new Ammo.btVector3(0, -10, 0));
    }

    function initGraphics() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('cube-container').appendChild(renderer.domElement);

        camera.position.z = 5;

        window.addEventListener('resize', onWindowResize, false);

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }

    function createCube() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        cubeMesh = new THREE.Mesh(geometry, material);
        scene.add(cubeMesh);

        const shape = new Ammo.btBoxShape(new Ammo.btVector3(0.5, 0.5, 0.5));
        const transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(0, 0, 0));
        const mass = 1;
        const localInertia = new Ammo.btVector3(0, 0, 0);
        shape.calculateLocalInertia(mass, localInertia);
        const motionState = new Ammo.btDefaultMotionState(transform);
        const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
        const body = new Ammo.btRigidBody(rbInfo);
        physicsWorld.addRigidBody(body);

        transformAux1 = new Ammo.btTransform();
    }

    function animate() {
        requestAnimationFrame(animate);

        // Step physics world
        physicsWorld.stepSimulation(1 / 60, 10);

        // Update graphics from physics
        const ms = cubeMesh.userData.physicsBody.getMotionState();
        if (ms) {
            ms.getWorldTransform(transformAux1);
            const p = transformAux1.getOrigin();
            const q = transformAux1.getRotation();
            cubeMesh.position.set(p.x(), p.y(), p.z());
            cubeMesh.quaternion.set(q.x(), q.y(), q.z(), q.w());
        }

        renderer.render(scene, camera);
    }

    // Add touch controls
    const hammer = new Hammer(document.getElementById('cube-container'));
    hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });

    let isPanning = false;
    let rotationSpeed = { x: 0, y: 0 };

    hammer.on('panstart', () => {
        isPanning = true;
    });
    hammer.on('panmove', (ev) => {
        if (isPanning) {
            cubeMesh.rotation.y += ev.deltaX * 0.01;
            cubeMesh.rotation.x += ev.deltaY * 0.01;
            rotationSpeed.x = ev.deltaY * 0.001;
            rotationSpeed.y = ev.deltaX * 0.001;
        }
    });
    hammer.on('panend', () => {
        isPanning = false;
    });

    function updatePhysics() {
        if (!isPanning) {
            cubeMesh.rotation.x += rotationSpeed.x;
            cubeMesh.rotation.y += rotationSpeed.y;
            // Apply friction
            rotationSpeed.x *= 0.95;
            rotationSpeed.y *= 0.95;
        }
        requestAnimationFrame(updatePhysics);
    }
    updatePhysics();
}